import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { Amplify } from "aws-amplify";
import { config } from "./config";
import { Authenticator } from "@aws-amplify/ui-react";

Amplify.configure({
  Auth: {
    mandatorySignIn: true,
    region: config.cognito.region,
    userPoolId: config.cognito.userPoolId,
    identityPoolId: config.cognito.identityPoolId,
    userPoolWebClientId: config.cognito.appClientId,
  },
  Storage: {
    AWSS3: {
      region: config.s3.region,
      bucket: config.s3.bucket,
      identityPoolId: config.cognito.identityPoolId,
    },
  },
  API: {
    endpoints: [
      {
        name: "todos",
        endpoint: config.apiGateway.url,
        region: config.apiGateway.region,
      },
    ],
  },
});

ReactDOM.render(
  <React.StrictMode>
    <div className="w-full min-w-screen h-full min-h-screen flex items-center justify-center bg-slate-900">
      <Authenticator>
        {({ signOut, user }) => <App signOut={signOut} user={user} />}
      </Authenticator>
    </div>
  </React.StrictMode>,
  document.getElementById("root")
);
