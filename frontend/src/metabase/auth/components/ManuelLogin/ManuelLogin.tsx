import { type JSX, useEffect, useRef } from "react";
import { t } from "ttag";

import { useExchangeSessionHandoffMutation } from "metabase/api";
import { useSearchParams } from "metabase/router";
import { Box, Loader } from "metabase/ui";
import { replaceLocation } from "metabase/utils/dom";

import { AuthLayout } from "../AuthLayout";

export const ManuelLogin = (): JSX.Element => {
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");
  const [exchangeCode, { isError }] = useExchangeSessionHandoffMutation();
  // A code works only once, so a re-run of the effect must not spend it again
  const exchangedCode = useRef<string | null>(null);

  useEffect(() => {
    if (code && exchangedCode.current !== code) {
      exchangedCode.current = code;
      exchangeCode({ code }).then((result) => {
        if (!result.error) {
          // `replace` keeps the URL with the code out of the browser history
          replaceLocation("/");
        }
      });
    }
  }, [code, exchangeCode]);

  return (
    <AuthLayout>
      {code && !isError ? (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Loader />
        </div>
      ) : (
        <Box fz="1rem" ta="center">
          {t`Please continue at Manuel.Ai`}
        </Box>
      )}
    </AuthLayout>
  );
};
