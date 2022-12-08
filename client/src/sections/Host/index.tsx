import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Form,
  Input,
  InputNumber,
  Layout,
  Radio,
  Typography,
  Upload
} from "antd";
import { HomeOutlined, PlusOutlined, BankOutlined } from "@ant-design/icons";
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import { UploadChangeParam } from "antd/lib/upload";
import { ListingType } from "../../lib/graphql/globalTypes";
import { iconColor, displayErrorMessage } from "../../lib/utils";
import { Viewer } from "../../lib/types";

interface Props {
  viewer: Viewer;
}

const { Content } = Layout;
const { Text, Title } = Typography;
const { Item } = Form;

const customSpin = <LoadingOutlined style={{ fontSize: 24 }} spin />;

export const Host = ({ viewer }: Props) => {
  const [imageLoading, setImageLoading] = useState(false);
  const [imageBase64Value, setImageBase64Value] = useState<string | null>(null);

  const handleImageUpload = (info: UploadChangeParam) => {
    const { file } = info;

    if (file.status === "uploading") {
      setImageLoading(true);
      return;
    }

    if (file.status === "done" && file.originFileObj) {
      getBase64Value(file.originFileObj, imageBase64Value => {
        setImageBase64Value(imageBase64Value);
        setImageLoading(false);
      });
    }
  };

  if (!viewer.id || !viewer.hasWallet) {
    return (
      <Content className="host-content">
        <div className="host__form-header">
          <Title level={4} className="host__form-title">
          Vous devrez être connecté à Jour-par-Jour et à Stripe pour héberger une annonce !
          </Title>
          <Text type="secondary">
          Nous n'autorisons que les utilisateurs qui se sont connectés à notre application et se sont connectés
             avec Stripe pour héberger de nouvelles annonces. Vous pouvez vous connecter sur la page{" "}
            <Link to="/login">/login</Link> et vous connecter avec Stripe peu de temps après.
          </Text>
        </div>
      </Content>
    );
  }

  const plusOrLoadingIcon = imageLoading ? (
    <Spin indicator={customSpin} />
  ) : (
    <PlusOutlined />
  );

  return (
    <Content className="host-content">
      <Form layout="vertical">
        <div className="host__form-header">
          <Title level={3} className="host__form-title">
          Salut! Commençons à répertorier votre logement.
          </Title>
          <Text type="secondary">
          Dans ce formulaire, nous collecterons des informations de base et supplémentaires sur votre annonce.
          </Text>
        </div>

        <Item label="Home Type">
          <Radio.Group>
            <Radio.Button value={ListingType.APARTMENT}>
              <BankOutlined  style={{ color: iconColor }}/> <span>Appartement</span>
            </Radio.Button>
            <Radio.Button value={ListingType.HOUSE}>
              <HomeOutlined  style={{ color: iconColor }}/> <span>Maison</span>
            </Radio.Button>
          </Radio.Group>
        </Item>

        <Item label="Titre" extra="Nombre maximum de caractères de 45">
          <Input maxLength={45} placeholder="L'emblématique et luxueux manoir Bel-Air" />
        </Item>

        <Item label="Description de l'annonce" extra="Nombre maximum de caractères de 400">
          <Input.TextArea
            rows={3}
            maxLength={400}
            placeholder={`
            Villa de rêve front de la mer avec piscine.
            `}
          />
        </Item>

        <Item label="Adresse">
          <Input placeholder="Av. Abou Bakr el Kadiri Route Principale 1029 Al Mostakbal,gh 4" />
        </Item>

        <Item label="Ville">
          <Input placeholder="Casablanca" />
        </Item>

        <Item label="État/Province">
          <Input placeholder="Settat-Casablanca" />
        </Item>

        <Item label="Zip / code postal">
          <Input placeholder="Veuillez saisir un code postal pour votre annonce!" />
        </Item>

        <Item
          label="Image"
          extra="Les images doivent avoir une taille inférieure à 1 Mo et être de type JPG ou PNG"
        >
          <div className="host__form-image-upload">
            <Upload
              name="image"
              listType="picture-card"
              showUploadList={false}
              
              customRequest = {dummyRequest}
              beforeUpload={beforeImageUpload}
              onChange={handleImageUpload}
            >
              {imageBase64Value ? (
                <div>
                <img src={imageBase64Value} alt="Listing" /> 
                {/*<br></br><br/><br/>
                <PlusOutlined/> Choissisez une autre image */}
                </div>
              ) : (
                <div>
                    {/* <Icon type={imageLoading ? "loading" : "plus"} /> */}
                    {/*
                  if({imageLoading}){
                    <Spin indicator={customSpin} />
                  }
                  else{
                    <PlusOutlined />
                  }
                  */}
                  {plusOrLoadingIcon}
                  <div className="ant-upload-text">Upload</div>
                </div>
              )}
              
            </Upload>
          </div>
        </Item>

        <Item label="Price" extra="Tous les prix en MAD/jour">
          <InputNumber min={0} placeholder="500" />
        </Item>

        <Item>
          <Button type="primary">Soumettre</Button>
        </Item>
      </Form>
    </Content>
  );
};

const beforeImageUpload = (file: File) => {
  const fileIsValidImage = file.type === "image/jpeg" || file.type === "image/png";
  const fileIsValidSize = file.size / 1024 / 1024 < 1;

  if (!fileIsValidImage) {
    displayErrorMessage("Vous ne pouvez télécharger que des fichiers JPG ou PNG valides!");
    return false;
  }

  if (!fileIsValidSize) {
    displayErrorMessage(
      "Vous ne pouvez télécharger que des fichiers image valides d'une taille inférieure à 1Mo!"
    );
    return false;
  }

  return fileIsValidImage && fileIsValidSize;
};

const getBase64Value = (  img: File | Blob,  callback: (imageBase64Value: string) => void) => {
  const reader = new FileReader();
  reader.readAsDataURL(img);
  reader.onload = () => {
    callback(reader.result as string);
  };
};

const dummyRequest = ( options: any) => {
  const { onSuccess } = options;
  setTimeout(() => {
    onSuccess("ok");
  }, 0);
}