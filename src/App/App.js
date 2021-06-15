import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Panels, Routable, Route } from "../../goldstone/Panels";
import ThemeDecorator from "../../goldstone/ThemeDecorator";

import MainPanel from "../views/MainPanel";
import AudioPanel from "../views/AudioPanel/AudioPanel";

const RoutablePanels = Routable({ navigate: "onBack" }, Panels);

const App = ({ path, ...rest }) => {
  return (
    <RoutablePanels {...rest} path={path}>
      <Route path="home" component={MainPanel} title="Home Page" />
      <Route path="audioplayer" component={AudioPanel} title="Audio Player" />
    </RoutablePanels>
  );
};

App.propTypes = {
  path: PropTypes.string,
};

const mapStateToProps = ({ path }) => {
  return {
    path: path.path,
  };
};

export default connect(mapStateToProps, {})(ThemeDecorator(App));
