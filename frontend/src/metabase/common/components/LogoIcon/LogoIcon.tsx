import { PLUGIN_LOGO_ICON_COMPONENTS } from "metabase/plugins";

import logo from "./manuel_logo.svg";

interface LogoIconProps {
  width?: number;
  height?: number;
  dark?: boolean;
  fill?: string;
}

export const DefaultLogoIcon = ({ height = 32, width }: LogoIconProps) => {
  return (
    <img
      src={logo}
      alt=""
      width={width}
      height={height}
      data-testid="main-logo"
    />
  );
};

export function LogoIcon(props: LogoIconProps) {
  const [Component = DefaultLogoIcon] = PLUGIN_LOGO_ICON_COMPONENTS;
  return <Component {...props} />;
}
