import React from "react";
import { Alert } from "antd";

interface Props {
  message?: string;
  description?: string;
}

export const ErrorBanner = ({
  message = "Oh oh ! Quelque chose s'est mal passé :(",
  description = "On dirait que quelque chose s'est mal passé. Veuillez vérifier votre connexion et/ou réessayer plus tard."
}: Props) => {
  return (
    <Alert
      banner
      closable
      message={message}
      description={description}
      type="error"
      className="error-banner"
    />
  );
};
