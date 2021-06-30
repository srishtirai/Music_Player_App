import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Panels, Routable, Route } from "../../goldstone/Panels";
import ThemeDecorator from "../../goldstone/ThemeDecorator";
import getBTDetails from '../actions/getBTDetails';
import getAdapterDetails from '../actions/getAdapterDetails';

import MainPanel from "../views/MainPanel";
import AudioPanel from "../views/AudioPanel/AudioPanel";

const RoutablePanels = Routable({ navigate: "onBack" }, Panels);

class App extends React.Component {
	constructor (props) {
		super(props);
	}
	componentDidMount = () => {
		if (typeof window === 'object' && window.PalmSystem) {
			this.onLaunch();
		}
		document.addEventListener('webOSRelaunch', this.onLaunch);
		document.addEventListener('webOSLocaleChange', () => {
			window.location.reload();
		});
	};

	onLaunch = () => {
		this.props.getAdapterDetails('getAdapterDetails').then((adapterAddress) => {
			this.props.getBTDetails(adapterAddress, 'getBTDetails');
		});
	};

  render () {
    const {path} = this.props;
    return (
      <RoutablePanels path={path}>
        <Route path="home" component={MainPanel} title="Home Page" />
        <Route path="audioplayer" component={AudioPanel} title="Audio Player" />
      </RoutablePanels>
    );
  }
};

App.propTypes = {
  getAdapterDetails: PropTypes.func,
	getBTDetails: PropTypes.func,
  path: PropTypes.string
};

const mapStateToProps = ({path}) => {
  return {
    path: path.path,
  };
};

const mapDispatchToProps = (dispatch) => ({
	getBTDetails: () => dispatch(getBTDetails()),
	getAdapterDetails: (adapterAddress, name) =>
		dispatch(getAdapterDetails(adapterAddress, name)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ThemeDecorator(App));
