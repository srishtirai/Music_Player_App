import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Panels, Routable, Route } from "../../goldstone/Panels";
import ThemeDecorator from "../../goldstone/ThemeDecorator";
import getBTDetails from '../actions/getBTDetails';
import getAdapterDetails from '../actions/getAdapterDetails';
import getNumberOfItems from '../actions/getNumberOfItems';
import MainPanel from "../views/MainPanel";
import AudioPanel from "../views/AudioPanel/AudioPanel";
import playerInfo from "../reducers/playerInfo";
import getFolderItems from '../actions/getFolderItems';
import getAVRCPStatus from "../actions/getAVRCPStatus";

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
			this.props.getBTDetails(adapterAddress, 'getBTDetails').then((address)=>{
				console.log("address: "+address)
				this.props.getAVRCPStatus(address).then((address)=>{
					console.log("AVRCP connected address: "+address)
					this.props.getNumberOfItems(address,'INITIAL').then((noOfItems)=>{
						console.log("No of Items INITIAL: "+noOfItems)
						this.props.getFolderItems(address,noOfItems,'INITIAL').then((path)=>{
							console.log("Folder path INITIAL: "+path)
							this.props.getNumberOfItems(address,'FINAL').then((noOfItems)=>{
								console.log("No of Items FINAL: "+noOfItems)
								this.props.getFolderItems(address,noOfItems,'FINAL').then((path)=>{
									console.log("Folder path FINAL: "+path)
									this.props.getNumberOfItems(address,'MUSIC_LIST').then((noOfItems)=>{
										console.log("No of Items MUSIC LIST: "+noOfItems)
										this.props.getFolderItems(address,noOfItems,'MUSIC_LIST');
									});
								});
							});
						});
					});
				});
			});
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
  path: PropTypes.string,
  getAVRCPStatus: PropTypes.func,
  getNumberOfItems: PropTypes.func,
};

const mapStateToProps = ({path,playerInfo,avrcpConnectionStatus, folderItems,noOfFolderItems}) => {
  return {
    path: path.path,
	address: avrcpConnectionStatus.address,
	// audioList: audio.audioList,
    playerInfo: playerInfo,
    avrcpStatus: avrcpConnectionStatus,
    folderItems: folderItems,
    noOfItems:noOfFolderItems.noOfItems
  };
};

const mapDispatchToProps = (dispatch) => ({
	getBTDetails: () => dispatch(getBTDetails()),
	getNumberOfItems: (address,step) => dispatch(getNumberOfItems(address,step)),
    getFolderItems: (address,res,step) => dispatch(getFolderItems(address,res,step)),
	getAdapterDetails: (adapterAddress, name) =>
		dispatch(getAdapterDetails(adapterAddress, name)),
	getAVRCPStatus: (address) => dispatch(getAVRCPStatus(address)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ThemeDecorator(App));
