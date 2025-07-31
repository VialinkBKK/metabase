import PropTypes from "prop-types";
import { Component } from "react";

import { PLUGIN_LOGO_ICON_COMPONENTS } from "metabase/plugins";

import logo from "./manuel_logo.svg";

export class DefaultLogoIcon extends Component {
  static defaultProps = {
    height: 32,
  };
  static propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    dark: PropTypes.bool,
    fill: PropTypes.string,
  };

  render() {
    const { height, width } = this.props;
    return <img src={logo} alt="" width={width} height={height} />;
  }
}

export default function LogoIcon(props) {
  const [Component = DefaultLogoIcon] = PLUGIN_LOGO_ICON_COMPONENTS;
  return <Component {...props} />;
}
