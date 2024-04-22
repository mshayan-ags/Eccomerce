import axios from "axios";
import { useEffect, useState } from "react";
import swal from "sweetalert";
import Card from "components/card";
import InputField from "components/fields/InputField";
import { withAuthContext } from "context/Auth";

function showError(err) {
  swal({
    text: err?.response?.data?.message || "There was some Error",
    button: { text: "Ok", closeModal: true },
    icon: "error",
    time: 3000,
  });
}

function authHeaders(Token) {
  return {
    headers: {
      Authorization: Token ? `${Token}` : `${localStorage.getItem("token")}`,
    },
  };
}

function TwoFactorSettings({ Token, currAdmin, GetCurrentAdmin }) {
  const [setup, setSetup] = useState(null);
  const [code, setCode] = useState("");
  const [disableCode, setDisableCode] = useState("");

  useEffect(() => {
    GetCurrentAdmin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function startSetup() {
    axios
      .post(`${process.env.REACT_APP_PUBLIC_PATH}/Admin-2FA/Setup`, {}, authHeaders(Token))
      .then((res) => {
        if (res?.data?.status == 200) {
          setSetup({ qrCode: res?.data?.qrCode, secret: res?.data?.secret });
        }
      })
      .catch(showError);
  }

  function confirmEnable() {
    if (!code) return;
    axios
      .post(`${process.env.REACT_APP_PUBLIC_PATH}/Admin-2FA/Enable`, { token: code }, authHeaders(Token))
      .then((res) => {
        swal({
          text: res?.data?.message,
          button: { text: "Ok", closeModal: true },
          icon: res?.data?.status == 200 ? "success" : "error",
          time: 3000,
        });
        if (res?.data?.status == 200) {
          setSetup(null);
          setCode("");
          GetCurrentAdmin();
        }
      })
      .catch(showError);
  }

  function disable2FA() {
    if (!disableCode) return;
    axios
      .post(`${process.env.REACT_APP_PUBLIC_PATH}/Admin-2FA/Disable`, { token: disableCode }, authHeaders(Token))
      .then((res) => {
        swal({
          text: res?.data?.message,
          button: { text: "Ok", closeModal: true },
          icon: res?.data?.status == 200 ? "success" : "error",
          time: 3000,
        });
        if (res?.data?.status == 200) {
          setDisableCode("");
          GetCurrentAdmin();
        }
      })
      .catch(showError);
  }

  return (
    <Card extra="w-full p-6">
      <h4 className="mb-1 text-xl font-bold text-navy-700 dark:text-white">
        Two-Factor Authentication
      </h4>
      <p className="mb-6 text-sm text-gray-600 dark:text-gray-300">
        Require an authenticator app code, in addition to your password, to sign in.
      </p>

      {currAdmin?.twoFactorEnabled ? (
        <div className="flex flex-col gap-3">
          <p className="text-sm font-semibold text-green-500">2FA is currently enabled on your account.</p>
          <div className="max-w-[280px]">
            <InputField
              variant="auth"
              extra="mb-2"
              label="Enter a code to disable 2FA"
              placeholder="123456"
              id="disableCode"
              type="text"
              value={disableCode}
              onChange={(e) => setDisableCode(e.target.value)}
            />
          </div>
          <button
            onClick={disable2FA}
            className="linear w-fit rounded-xl bg-red-500 px-4 py-[10px] text-sm font-medium text-white transition duration-200 hover:bg-red-600"
          >
            Disable 2FA
          </button>
        </div>
      ) : setup ? (
        <div className="flex flex-col gap-3">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Scan this QR code with Google Authenticator, Authy, or a similar app, then enter the 6-digit code it shows.
          </p>
          <img src={setup.qrCode} alt="2FA QR Code" className="h-[180px] w-[180px]" />
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Can't scan? Enter this code manually: <span className="font-mono font-semibold">{setup.secret}</span>
          </p>
          <div className="max-w-[280px]">
            <InputField
              variant="auth"
              extra="mb-2"
              label="Authentication Code*"
              placeholder="123456"
              id="code"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={confirmEnable}
              className="linear w-fit rounded-xl bg-brand-500 px-4 py-[10px] text-sm font-medium text-white transition duration-200 hover:bg-brand-600"
            >
              Confirm & Enable
            </button>
            <button
              onClick={() => setSetup(null)}
              className="linear w-fit rounded-xl border border-gray-300 px-4 py-[10px] text-sm font-medium text-navy-700 dark:text-white"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={startSetup}
          className="linear w-fit rounded-xl bg-brand-500 px-4 py-[10px] text-sm font-medium text-white transition duration-200 hover:bg-brand-600"
        >
          Enable 2FA
        </button>
      )}
    </Card>
  );
}

export default withAuthContext(TwoFactorSettings);
