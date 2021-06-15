/**
 * A higher-order component to add a goldstone styled popup to a component.
 *
 * @module goldstone/ContextualPopupDecorator
 * @exports	ContextualPopup
 * @exports	ContextualPopupDecorator
 */

import ApiDecorator from '@enact/core/internal/ApiDecorator';
import {on, off} from '@enact/core/dispatcher';
import {handle, forProp, forKey, forward, stop} from '@enact/core/handle';
import hoc from '@enact/core/hoc';
import EnactPropTypes from '@enact/core/internal/prop-types';
import {extractAriaProps} from '@enact/core/util';
import {I18nContextDecorator} from '@enact/i18n/I18nDecorator';
import Spotlight, {getDirection} from '@enact/spotlight';
import SpotlightContainerDecorator from '@enact/spotlight/SpotlightContainerDecorator';
import FloatingLayer from '@enact/ui/FloatingLayer';
import ri from '@enact/ui/resolution';
import compose from 'ramda/src/compose';
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import {ContextualPopup} from './ContextualPopup';
import css from './ContextualPopupDecorator.module.less';

/**
 * Default config for {@link goldstone/ContextualPopupDecorator.ContextualPopupDecorator}
 *
 * @type {Object}
 * @hocconfig
 * @memberof goldstone/ContextualPopupDecorator.ContextualPopupDecorator
 */
const defaultConfig = {
	/**
	 * `ContextualPopup` without the arrow.
	 *
	 * @type {Boolean}
	 * @default false
	 * @memberof goldstone/ContextualPopupDecorator.ContextualPopupDecorator.defaultConfig
	 * @public
	 */
	noArrow: false,

	/**
	 * Disables passing the `skin` prop to the wrapped component.
	 *
	 * @see {@link goldstone/Skinnable.Skinnable.skin}
	 * @type {Boolean}
	 * @default false
	 * @memberof goldstone/ContextualPopupDecorator.ContextualPopupDecorator.defaultConfig
	 * @public
	 */
	noSkin: false,

	/**
	 * The prop in which to pass the value of `open` state of ContextualPopupDecorator to the
	 * wrapped component.
	 *
	 * @type {String}
	 * @default 'selected'
	 * @memberof goldstone/ContextualPopupDecorator.ContextualPopupDecorator.defaultConfig
	 * @public
	 */
	openProp: 'selected'
};

const ContextualPopupContainer = SpotlightContainerDecorator(
	{enterTo: 'default-element', preserveId: true},
	ContextualPopup
);

const Decorator = hoc(defaultConfig, (config, Wrapped) => {
	const {noArrow, noSkin, openProp} = config;

	return class extends React.Component {
		static displayName = 'ContextualPopupDecorator';

		static propTypes = {
			'data-webos-voice-exclusive': PropTypes.bool,
			direction: PropTypes.oneOf(['above', 'above center', 'above left', 'above right', 'below', 'below center', 'below left', 'below right', 'left middle', 'left top', 'left bottom', 'right middle', 'right top', 'right bottom']),
			noAutoDismiss: PropTypes.bool,
			onClose: PropTypes.func,
			onOpen: PropTypes.func,
			open: PropTypes.bool,
			popupClassName: PropTypes.string,
			popupComponent: EnactPropTypes.component.isRequired,
			popupProps: PropTypes.object,
			popupSpotlightId: PropTypes.string,
			rtl: PropTypes.bool,
			setApiProvider: PropTypes.func,
			skin: PropTypes.string,
			spotlightRestrict: PropTypes.oneOf(['none', 'self-first', 'self-only'])
		};

		static defaultProps = {
			'data-webos-voice-exclusive': true,
			direction: 'below center',
			noAutoDismiss: false,
			open: false,
			spotlightRestrict: 'self-first'
		};

		constructor (props) {
			super(props);
			this.state = {
				arrowPosition: {top: 0, left: 0},
				containerPosition: {top: 0, left: 0},
				containerId: Spotlight.add(this.props.popupSpotlightId),
				activator: null
			};

			this.overflow = {};
			this.adjustedDirection = this.props.direction;

			this.ARROW_WIDTH = ri.scale(60); // svg arrow width. used for arrow positioning
			this.ARROW_OFFSET = noArrow ? 0 : ri.scale(36); // actual distance of the svg arrow displayed to offset overlaps with the container. Offset is when `noArrow` is false.
			this.MARGIN = noArrow ? ri.scale(6) : ri.scale(18); // margin from an activator to the contextual popup.
			this.KEEPOUT = ri.scale(24); // keep out distance on the edge of the screen

			if (props.setApiProvider) {
				props.setApiProvider(this);
			}
		}

		componentDidMount () {
			if (this.props.open) {
				on('keydown', this.handleKeyDown);
				on('keyup', this.handleKeyUp);
			}
		}

		getSnapshotBeforeUpdate (prevProps, prevState) {
			if (prevProps.open && !this.props.open) {
				const current = Spotlight.getCurrent();
				return {
					shouldSpotActivator: (
						// isn't set
						!current ||
						// is on the activator and we want to re-spot it so a11y read out can occur
						current === prevState.activator ||
						// is within the popup
						this.containerNode.contains(current)
					)
				};
			}
			return null;
		}

		componentDidUpdate (prevProps, prevState, snapshot) {
			if (prevProps.direction !== this.props.direction) {
				this.adjustedDirection = this.props.direction;
				// NOTE: `setState` is called and will cause re-render
				this.positionContextualPopup();
			}

			if (this.props.open && !prevProps.open) {
				on('keydown', this.handleKeyDown);
				on('keyup', this.handleKeyUp);
			} else if (!this.props.open && prevProps.open) {
				off('keydown', this.handleKeyDown);
				off('keyup', this.handleKeyUp);
				if (snapshot && snapshot.shouldSpotActivator) {
					this.spotActivator(prevState.activator);
				}
			}
		}

		componentWillUnmount () {
			if (this.props.open) {
				off('keydown', this.handleKeyDown);
				off('keyup', this.handleKeyUp);
			}
			Spotlight.remove(this.state.containerId);
		}

		updateLeaveFor (activator) {
			Spotlight.set(this.state.containerId, {
				leaveFor: {
					up: activator,
					down: activator,
					left: activator,
					right: activator
				}
			});
		}

		getContainerAdjustedPosition = () => {
			const position = this.adjustedDirection;
			const arr = this.adjustedDirection.split(' ');
			let direction = null;
			let anchor = null;

			if (arr.length === 2) {
				[direction, anchor] = arr;
			} else {
				direction = position;
			}

			return {anchor, direction};
		};

		getContainerPosition (containerNode, clientNode) {
			const position = this.centerContainerPosition(containerNode, clientNode);
			const {direction} = this.getContainerAdjustedPosition();

			switch (direction) {
				case 'above':
					position.top = clientNode.top - this.ARROW_OFFSET - containerNode.height - this.MARGIN;
					break;
				case 'below':
					position.top = clientNode.bottom + this.ARROW_OFFSET + this.MARGIN;
					break;
				case 'right':
					position.left = this.props.rtl ? clientNode.left - containerNode.width - this.ARROW_OFFSET - this.MARGIN : clientNode.right + this.ARROW_OFFSET + this.MARGIN;
					break;
				case 'left':
					position.left = this.props.rtl ? clientNode.right + this.ARROW_OFFSET + this.MARGIN : clientNode.left - containerNode.width - this.ARROW_OFFSET - this.MARGIN;
					break;
			}

			return this.adjustRTL(position);
		}

		centerContainerPosition (containerNode, clientNode) {
			const pos = {};
			const {anchor, direction} = this.getContainerAdjustedPosition();

			if (direction === 'above' || direction === 'below') {
				if (this.overflow.isOverLeft) {
					// anchor to the left of the screen
					pos.left = this.KEEPOUT;
				} else if (this.overflow.isOverRight) {
					// anchor to the right of the screen
					pos.left = window.innerWidth - containerNode.width - this.KEEPOUT;
				} else if (anchor) {
					if (anchor === 'center') {
						// center horizontally
						pos.left = clientNode.left + (clientNode.width - containerNode.width) / 2;
					} else if (anchor === 'left') {
						// anchor to the left side of the activator
						pos.left = clientNode.left;
					} else {
						// anchor to the right side of the activator
						pos.left = clientNode.right - containerNode.width;
					}
				} else {
					// anchor to the left side of the activator, matching its width
					pos.left = clientNode.left;
					pos.width = clientNode.width;
				}

			} else if (direction === 'left' || direction === 'right') {
				if (this.overflow.isOverTop) {
					// anchor to the top of the screen
					pos.top = this.KEEPOUT;
				} else if (this.overflow.isOverBottom) {
					// anchor to the bottom of the screen
					pos.top = window.innerHeight - containerNode.height - this.KEEPOUT;
				} else if (anchor === 'middle') {
					// center vertically
					pos.top = clientNode.top - (containerNode.height - clientNode.height) / 2;
				} else if (anchor === 'top') {
					// anchor to the top of the activator
					pos.top = clientNode.top;
				} else {
					// anchor to the bottom of the activator
					pos.top = clientNode.bottom - containerNode.height;
				}
			}

			return pos;
		}

		getArrowPosition (containerNode, clientNode) {
			const position = {};
			const {anchor, direction} = this.getContainerAdjustedPosition();

			if (direction === 'above' || direction === 'below') {
				if (this.overflow.isOverRight && !this.overflow.isOverLeft) {
					position.left = window.innerWidth - ((containerNode.width + this.ARROW_WIDTH) / 2) - this.KEEPOUT;
				} else if (!this.overflow.isOverRight && this.overflow.isOverLeft) {
					position.left = ((containerNode.width - this.ARROW_WIDTH) / 2) + this.KEEPOUT;
				} else if (anchor === 'left') {
					position.left = clientNode.left + (containerNode.width - this.ARROW_WIDTH) / 2;
				} else if (anchor === 'right') {
					position.left = clientNode.right - containerNode.width + (containerNode.width - this.ARROW_WIDTH) / 2;
				} else {
					position.left = clientNode.left + (clientNode.width - this.ARROW_WIDTH) / 2;
				}
			} else if (this.overflow.isOverBottom && !this.overflow.isOverTop) {
				position.top = window.innerHeight - ((containerNode.height + this.ARROW_WIDTH) / 2) - this.KEEPOUT;
			} else if (!this.overflow.isOverBottom && this.overflow.isOverTop) {
				position.top = ((containerNode.height - this.ARROW_WIDTH) / 2) + this.KEEPOUT;
			} else if (anchor === 'top') {
				position.top = clientNode.top + (containerNode.height - this.ARROW_WIDTH) / 2;
			} else if (anchor === 'bottom') {
				position.top = clientNode.bottom - containerNode.height + (containerNode.height - this.ARROW_WIDTH) / 2;
			} else {
				position.top = clientNode.top + (clientNode.height - this.ARROW_WIDTH) / 2;
			}

			switch (direction) {
				case 'above':
					position.top = clientNode.top - this.ARROW_WIDTH - this.MARGIN;
					break;
				case 'below':
					position.top = clientNode.bottom + this.MARGIN;
					break;
				case 'left':
					position.left = this.props.rtl ? clientNode.left + clientNode.width + this.MARGIN : clientNode.left - this.ARROW_WIDTH - this.MARGIN;
					break;
				case 'right':
					position.left = this.props.rtl ? clientNode.left - this.ARROW_WIDTH - this.MARGIN : clientNode.left + clientNode.width + this.MARGIN;
					break;
				default:
					return {};
			}

			return this.adjustRTL(position);
		}

		calcOverflow (container, client) {
			let containerHeight, containerWidth;
			const {anchor, direction} = this.getContainerAdjustedPosition();

			if (direction === 'above' || direction === 'below') {
				containerHeight = container.height;
				containerWidth = (container.width - client.width) / 2;
			} else {
				containerHeight = (container.height - client.height) / 2;
				containerWidth = container.width;
			}

			this.overflow = {
				isOverTop: anchor === 'top' && (direction === 'left' || direction === 'right') ?
					!(client.top > this.KEEPOUT) :
					client.top - containerHeight - this.ARROW_OFFSET - this.MARGIN - this.KEEPOUT < 0,
				isOverBottom: anchor === 'bottom' && (direction === 'left' || direction === 'right') ?
					client.bottom + this.KEEPOUT > window.innerHeight :
					client.bottom + containerHeight + this.ARROW_OFFSET + this.MARGIN + this.KEEPOUT > window.innerHeight,
				isOverLeft: anchor === 'left' && (direction === 'above' || direction === 'below') ?
					!(client.left > this.KEEPOUT) :
					client.left - containerWidth - this.ARROW_OFFSET - this.MARGIN - this.KEEPOUT < 0,
				isOverRight: anchor === 'right' && (direction === 'above' || direction === 'below') ?
					client.right + this.KEEPOUT > window.innerWidth :
					client.right + containerWidth + this.ARROW_OFFSET + this.MARGIN + this.KEEPOUT > window.innerWidth
			};
		}

		adjustDirection () {
			const {anchor, direction} = this.getContainerAdjustedPosition();

			if (this.overflow.isOverTop && !this.overflow.isOverBottom && direction === 'above') {
				this.adjustedDirection = anchor ? `below ${anchor}` : 'below';
			} else if (this.overflow.isOverBottom && !this.overflow.isOverTop && direction === 'below') {
				this.adjustedDirection = anchor ? `above ${anchor}` : 'above';
			} else if (this.overflow.isOverLeft && !this.overflow.isOverRight && direction === 'left' && !this.props.rtl) {
				this.adjustedDirection = anchor ? `right ${anchor}` : 'right';
			} else if (this.overflow.isOverRight && !this.overflow.isOverLeft && direction === 'right' && !this.props.rtl) {
				this.adjustedDirection = anchor ? `left ${anchor}` : 'left';
			}
		}

		adjustRTL (position) {
			let pos = position;
			if (this.props.rtl) {
				const tmpLeft = pos.left;
				pos.left = pos.right;
				pos.right = tmpLeft;
			}
			return pos;
		}

		/**
		 * Position the popup in relation to the activator.
		 *
		 * Position is based on the dimensions of the popup and its activator. If the popup does not
		 * fit in the specified direction, it will automatically flip to the opposite direction.
		 *
		 * @method
		 * @memberof goldstone/ContextualPopupDecorator.ContextualPopupDecorator.prototype
		 * @public
		 * @returns {undefined}
		 */
		positionContextualPopup = () => {
			if (this.containerNode && this.clientNode) {
				const containerNode = this.containerNode.getBoundingClientRect();
				const {top, left, bottom, right, width, height} = this.clientNode.getBoundingClientRect();
				const clientNode = {top, left, bottom, right, width, height};
				clientNode.left = this.props.rtl ? window.innerWidth - right : left;
				clientNode.right = this.props.rtl ? window.innerWidth - left : right;

				this.calcOverflow(containerNode, clientNode);
				this.adjustDirection();

				this.setState({
					direction: this.adjustedDirection,
					arrowPosition: this.getArrowPosition(containerNode, clientNode),
					containerPosition: this.getContainerPosition(containerNode, clientNode)
				});
			}
		};

		getContainerNode = (node) => {
			this.containerNode = node;
		};

		getClientNode = (node) => {
			this.clientNode = ReactDOM.findDOMNode(node); // eslint-disable-line react/no-find-dom-node
		};

		handle = handle.bind(this);

		handleKeyUp = this.handle(
			forProp('open', true),
			forKey('enter'),
			() => Spotlight.getCurrent() === this.state.activator,
			stop,
			forward('onClose')
		);

		handleOpen = (ev) => {
			forward('onOpen', ev, this.props);
			this.positionContextualPopup();
			const current = Spotlight.getCurrent();
			this.updateLeaveFor(current);
			this.setState({
				activator: current
			});
			this.spotPopupContent();
		};

		handleClose = () => {
			this.updateLeaveFor(null);
			this.setState({
				activator: null
			});
		};

		handleDirectionalKey (ev) {
			// prevent default page scrolling
			ev.preventDefault();
			// stop propagation to prevent default spotlight behavior
			ev.stopPropagation();
			// set the pointer mode to false on keydown
			Spotlight.setPointerMode(false);
		}

		// handle key event from outside (i.e. the activator) to the popup container
		handleKeyDown = (ev) => {
			const {activator, containerId} = this.state;
			const {spotlightRestrict} = this.props;
			const current = Spotlight.getCurrent();
			const direction = getDirection(ev.keyCode);

			if (!direction) return;

			const hasSpottables = Spotlight.getSpottableDescendants(containerId).length > 0;
			const spotlessSpotlightModal = spotlightRestrict === 'self-only' && !hasSpottables;
			const shouldSpotPopup = current === activator && direction === this.adjustedDirection && hasSpottables;

			if (shouldSpotPopup || spotlessSpotlightModal) {
				this.handleDirectionalKey(ev);

				// we guard against attempting a focus change by verifying the case where a
				// spotlightModal popup contains no spottable components
				if (!spotlessSpotlightModal && shouldSpotPopup) {
					this.spotPopupContent();
				}
			}
		};

		// handle key event from contextual popup and closes the popup
		handleContainerKeyDown = (ev) => {
			// Note: Container will be only rendered if `open`ed, therefore no need to check for `open`
			const direction = getDirection(ev.keyCode);

			if (!direction) return;

			this.handleDirectionalKey(ev);

			// if focus moves outside the popup's container, issue the `onClose` event
			if (Spotlight.move(direction) && !this.containerNode.contains(Spotlight.getCurrent())) {
				forward('onClose', ev, this.props);
			}
		};

		spotActivator = (activator) => {
			if (!Spotlight.getPointerMode() && activator && activator === Spotlight.getCurrent()) {
				activator.blur();
			}
			if (!Spotlight.focus(activator)) {
				Spotlight.focus();
			}
		};

		spotPopupContent = () => {
			const {spotlightRestrict} = this.props;
			const {containerId} = this.state;
			const spottableDescendants = Spotlight.getSpottableDescendants(containerId);
			if (spotlightRestrict === 'self-only' && spottableDescendants.length && Spotlight.getCurrent()) {
				Spotlight.getCurrent().blur();
			}

			if (!Spotlight.focus(containerId)) {
				Spotlight.setActiveContainer(containerId);
			}
		};

		render () {
			const {'data-webos-voice-exclusive': voiceExclusive, popupComponent: PopupComponent, popupClassName, noAutoDismiss, open, onClose, popupProps, skin, spotlightRestrict, ...rest} = this.props;
			const scrimType = spotlightRestrict === 'self-only' ? 'transparent' : 'none';
			const popupPropsRef = Object.assign({}, popupProps);
			const ariaProps = extractAriaProps(popupPropsRef);

			if (!noSkin) {
				rest.skin = skin;
			}

			delete rest.onOpen;
			delete rest.popupSpotlightId;
			delete rest.rtl;
			delete rest.setApiProvider;

			if (openProp) rest[openProp] = open;

			return (
				<div className={css.contextualPopupDecorator}>
					<FloatingLayer
						noAutoDismiss={noAutoDismiss}
						onClose={this.handleClose}
						onDismiss={onClose}
						onOpen={this.handleOpen}
						open={open}
						scrimType={scrimType}
					>
						<ContextualPopupContainer
							{...ariaProps}
							className={popupClassName}
							onKeyDown={this.handleContainerKeyDown}
							direction={this.state.direction}
							arrowPosition={this.state.arrowPosition}
							containerPosition={this.state.containerPosition}
							containerRef={this.getContainerNode}
							data-webos-voice-exclusive={voiceExclusive}
							showArrow={!noArrow}
							skin={skin}
							spotlightId={this.state.containerId}
							spotlightRestrict={spotlightRestrict}
						>
							<PopupComponent {...popupPropsRef} />
						</ContextualPopupContainer>
					</FloatingLayer>
					<Wrapped ref={this.getClientNode} {...rest} />
				</div>
			);
		}
	};
});

/**
 * Adds support for positioning a
 * [ContextualPopup]{@link golddstone/ContextualPopupDecorator.ContextualPopup} relative to the
 * wrapped component.
 *
 * `ContextualPopupDecorator` may be used to show additional settings or actions rendered within a
 * small floating popup.
 *
 * Usage:
 * ```
 * const ButtonWithPopup = ContextualPopupDecorator(Button);
 * <ButtonWithPopup
 *   direction="above center"
 *   open={this.state.open}
 *   popupComponent={CustomPopupComponent}
 * >
 *   Open Popup
 * </ButtonWithPopup>
 * ```
 *
 * @hoc
 * @memberof golddstone/ContextualPopupDecorator
 * @public
 */
const ContextualPopupDecorator = compose(
	ApiDecorator({api: ['positionContextualPopup']}),
	I18nContextDecorator({rtlProp: 'rtl'}),
	Decorator
);

export default ContextualPopupDecorator;
export {
	ContextualPopupDecorator,
	ContextualPopup
};