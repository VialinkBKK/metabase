(ns metabase.session.challenge-test
  "Round-trip tests for the MFA challenge token (JWT sign/verify)."
  (:require
   [clojure.test :refer :all]
   [metabase.session.challenge :as session.challenge]
   [metabase.test.fixtures :as fixtures]))

(set! *warn-on-reflection* true)

(use-fixtures :once (fixtures/initialize :db))

(deftest round-trip-test
  (testing "a signed token verifies and returns the expected claims"
    (let [token  (session.challenge/issue-challenge-token 42 :provider/password)
          claims (session.challenge/verify-challenge-token token)]
      (is (map? claims))
      (is (= 42 (:user-id claims)))
      (is (= "password" (:provider claims)))
      (is (= "mfa-challenge" (:purpose claims)))
      (is (string? (:jti claims)))
      (is (pos? (:exp claims)))))
  (testing "a tampered token returns nil"
    (let [token (session.challenge/issue-challenge-token 1 :provider/ldap)
          bad   (str token "tampered")]
      (is (nil? (session.challenge/verify-challenge-token bad)))))
  (testing "a garbage string returns nil"
    (is (nil? (session.challenge/verify-challenge-token "not-a-jwt"))))
  (testing "an empty string returns nil"
    (is (nil? (session.challenge/verify-challenge-token "")))))

(deftest handoff-code-round-trip-test
  (let [code (session.challenge/issue-handoff-code 42 "password" "session-row-id" 7)]
    (testing "a signed code verifies and returns the expected claims"
      (is (=? {:user-id              42
               :provider             "password"
               :session-id           "session-row-id"
               :mfa-auth-identity-id 7
               :purpose              "session-handoff"}
              (session.challenge/verify-handoff-code code))))
    (testing "a code expires within a minute"
      (is (<= (:exp (session.challenge/verify-handoff-code code))
              (+ (quot (System/currentTimeMillis) 1000) 60))))
    (testing "a tampered code returns nil"
      (is (nil? (session.challenge/verify-handoff-code (str code "tampered")))))
    (testing "tokens are not interchangeable between purposes"
      (is (nil? (session.challenge/verify-challenge-token code)))
      (is (nil? (session.challenge/verify-enrollment-token code)))
      (is (nil? (session.challenge/verify-handoff-code (session.challenge/issue-challenge-token 42 "password")))))))
