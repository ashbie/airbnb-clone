import React from "react";
import { Menu, Button, Avatar } from "antd";
import { HomeOutlined, UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { Viewer } from "../../../../lib/types";
import { useMutation } from "@apollo/react-hooks";
import { displayErrorMessage, displaySuccessNotification, LOG_OUT } from "../../../../lib";
import { LogOut as LogOutData} from "../../../../lib/graphql/mutations/LogOut/__generated__/LogOut";

const { Item, SubMenu } = Menu;

interface Props {
    viewer: Viewer;
    setViewer: (viewer: Viewer) => void;
}

export const MenuItems = ({viewer, setViewer}: Props) => {
    const [logOut] = useMutation<LogOutData>(LOG_OUT, {
        onCompleted(data) {
            if(data && data.logOut){
                setViewer(data.logOut);
                sessionStorage.removeItem("token");
                displaySuccessNotification("Vous vous êtes déconnecté avec succès!");
            }
        },
        onError(error) {
            displayErrorMessage("Pardon! Nous n'avons pas pu vous déconnecter. Veuillez réessayer plus tard!");
        }
    });

    const handleLogOut = () => {
        logOut();
    }

    const subMenuLogin = viewer.id && viewer.avatar ? (
    <SubMenu  title={<Avatar  src={viewer.avatar} />}>
        <Item key="/user">
            <Link to={`/user/${viewer.id}`}>
            <UserOutlined></UserOutlined>
            &nbsp;&nbsp;Profile
            </Link>
        </Item>
        <Item key="/logout">
            <div onClick={handleLogOut}>
            <LogoutOutlined />
            &nbsp;&nbsp;Se deconnecter
            </div>
        </Item>
    </SubMenu>
    ): (<Item>
        <Link to="/login">
            <Button type="primary">Se connecter</Button>
        </Link>
    </Item>
    );


    return(
        // Menu is supposed to have a selectable attribute. Check the documentation
        <Menu mode="horizontal"  className="menu">
            <Item key="/host">
                <Link to="/">
                    <HomeOutlined type="home"></HomeOutlined>
                    &nbsp;&nbsp;Devenez hôte
                </Link>
            </Item>
            {subMenuLogin}
        </Menu>
    );
}