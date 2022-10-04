import React, { Fragment } from "react";
import { Avatar, Button, Card, Divider, Typography } from "antd";
import { User as UserData } from "../../../../lib/graphql/queries/User/__generated__/User";


interface Props {
    user: UserData["user"];
    viewerIsUser: boolean;
}

const { Paragraph, Text, Title } = Typography;

export const UserProfile = ({ user, viewerIsUser }: Props) => {
    const additionalDetailsSection = viewerIsUser ? (
        <Fragment>
          <Divider />
          <div className="user-profile__details">
            <Title level={4}>Détails supplémentaires</Title>
            <Paragraph>
            Intéressé à devenir un hôte Jour-par-Jour ? Enregistrez-vous avec votre compte Stripe !
            </Paragraph>
            <Button type="primary" className="user-profile__details-cta">
            Connectez-vous avec Stripe
            </Button>
            <Paragraph type="secondary">
            Jour-par-jour utilise{" "}
              <a
                href="https://stripe.com/en-US/connect"
                target="_blank"
                rel="noopener noreferrer"
              >
                Stripe
              </a>{" "}
              pour vous aider à transférer vos revenus de manière sécurisée et fiable.
            </Paragraph>
          </div>
        </Fragment>
      ) : null;
      //console.log(`user avatar:${user.avatar}`);
      return (
        <div className="user-profile">
          <Card className="user-profile__card">
            <div className="user-profile__avatar">
              <Avatar size={100} src={user.avatar} />
              
            </div>
            <Divider />
            <div className="user-profile__details">
              <Title level={4}>Détails</Title>
              <Paragraph>
              Nom: <Text strong>{user.name}</Text>
              </Paragraph>
              <Paragraph>
                Contact: <Text strong>{user.contact}</Text>
              </Paragraph>
            </div>
            {additionalDetailsSection}
          </Card>
        </div>
      );
}