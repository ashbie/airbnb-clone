import React from "react";
import { Skeleton, Alert, Divider } from "antd";
import "./styles/ListingsSkeleton.css"

interface Props {
    title: string;
    error?: boolean;
}

export const ListingsSkeleton = ({title, error = false}: Props) => {
    
    const ifError = error ? (<Alert message="Oh oh! Quelque chose c'est mal passé. Merci d'essayer plus tard! :(" type="error" className="listings-skeleton-error-method-1"></Alert>) : null ;
    
    return <div className="listings-skeleton">
        <h2>{title}</h2>
        <div className="listings-skeleton-error-method-2">{ifError}</div>
        <Skeleton active paragraph={{rows:1}}></Skeleton>
        <Divider/>
        <Skeleton active paragraph={{rows:1}}></Skeleton>
        <Divider/>
        <Skeleton active paragraph={{rows:1}}></Skeleton>
    </div>;
}