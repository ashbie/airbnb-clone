import React from 'react';

interface Props{
    title: string;
}

export const Listings = (props: Props) => {
    return <h1>{ props.title }</h1>;
}