import Cookies from "js-cookie";
import { type JSX, useEffect } from "react";

import { useSearchParams } from "metabase/router";
import { Box, Loader } from "metabase/ui";

import { AuthLayout } from "../AuthLayout";

const METABASE_SESSION_COOKIE = "metabase.SESSION";

export const ManuelLogin = (): JSX.Element => {
  const [searchParams] = useSearchParams();
  const sessionUid = searchParams.get("session");

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
