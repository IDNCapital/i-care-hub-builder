/**
 * Test de supabase/functions/_shared/notificationRecipients.ts, exécuté avec
 * `node --experimental-strip-types tests/notification-recipients.test.mts`.
 */
import assert from "node:assert/strict";
import { buildInternalRecipients } from "../supabase/functions/_shared/notificationRecipients.ts";

assert.deepEqual(buildInternalRecipients("n.idelot@idn-capital.fr", "contact@i-ca.re"), { to: "n.idelot@idn-capital.fr", cc: "contact@i-ca.re" });
assert.deepEqual(buildInternalRecipients("Contact@I-CA.re", "contact@i-ca.re"), { to: "Contact@I-CA.re" });
assert.deepEqual(buildInternalRecipients(undefined, "contact@i-ca.re"), { to: "contact@i-ca.re" });
assert.deepEqual(buildInternalRecipients("", "no-reply@i-ca.re"), { to: "no-reply@i-ca.re", cc: "contact@i-ca.re" });
assert.deepEqual(buildInternalRecipients(null, null), { to: "contact@i-ca.re" });
console.log("notification-recipients : ok");
