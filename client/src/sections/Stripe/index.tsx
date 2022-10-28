import React, { useEffect, useRef } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/react-hooks";
import { Layout, Spin } from "antd";
import { CONNECT_STRIPE } from "../../lib/graphql/mutations";
import {
  ConnectStripe as ConnectStripeData,
  ConnectStripeVariables
} from "../../lib/graphql/mutations/ConnectStripe/__generated__/ConnectStripe";
import { displaySuccessNotification } from "../../lib/utils";
import { Viewer } from "../../lib/types";

interface Props {
  viewer: Viewer;
  setViewer: (viewer: Viewer) => void;
}

const { Content } = Layout;

export const Stripe = ({ viewer, setViewer }: Props) => {
  const [connectStripe, { data, loading, error }] = useMutation<
    ConnectStripeData,
    ConnectStripeVariables
  >(CONNECT_STRIPE, {
    onCompleted: data => {
      if (data && data.connectStripe) {
        setViewer({ ...viewer, hasWallet: data.connectStripe.hasWallet });
        displaySuccessNotification(
          "Vous avez connecté avec succès votre compte Stripe!",
          "Vous pouvez maintenant commencer à créer des annonces dans la page Hôte."
        );
      }
    }
  });
  const connectStripeRef = useRef(connectStripe);
  const navigate = useNavigate();
  const navigateRef = useRef(navigate);


  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get("code");

    if (code) {
      connectStripeRef.current({
        variables: {
          input: { code }
        }
      });
    } else {
      navigateRef.current("/login?sneak=yes", {replace: true});
    }
  }, []);

  if (data && data.connectStripe) {
    return <Navigate to={`/user/${viewer.id}`} />;
  }

  if (loading) {
    return (
      <Content className="stripe">
        <Spin size="large" tip="Connexion de votre compte Stripe..." />
      </Content>
    );
  }

  if (error) {
    return <Navigate to={`/user/${viewer.id}?stripe_error=true`} />;
  }

  return null;
};
