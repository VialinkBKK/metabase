import type { Location } from "history";
import Cookies from "js-cookie";
import { useEffect } from "react";

import { METABASE_SESSION_COOKIE } from "metabase/lib/cookies";
import { Box, Loader } from "metabase/ui";

import { AuthLayout } from "../AuthLayout";

interface ManuelLoginQueryString {
  session?: string;
  redirect?: string;
}

interface ManuelLoginProps {
  location?: Location<ManuelLoginQueryString>;
}

export const ManuelLogin = ({ location }: ManuelLoginProps): JSX.Element => {
  const sessionUid = location?.query?.session;

  useEffect(() => {
    if (sessionUid) {
      Cookies.set(METABASE_SESSION_COOKIE, sessionUid);
      window.location.href = "/";
    }
  }, [sessionUid]);

  return (
    <AuthLayout>
      {sessionUid ? (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Loader />
        </div>
      ) : (
        // eslint-disable-next-line i18next/no-literal-string
        <Box fz="1rem" ta="center">
          Please continue at Manuel.Ai
        </Box>
      )}
    </AuthLayout>
  );
};
