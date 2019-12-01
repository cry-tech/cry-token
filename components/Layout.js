import React from 'react';
import { Container } from 'semantic-ui-react';
import Head from 'next/head';
import Header from './Header';
import Footer from './Footer';

export default props => {
    return (
        <div className="container" id="wrap">
            <Head>
                <link rel="stylesheet" href="/styles/main.css" />
                <link rel="stylesheet" href="//cdn.jsdelivr.net/npm/semantic-ui@2.4.2/dist/semantic.min.css" />
                <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous" />
                <link rel="stylesheet" href="/fontawesome-free-5.11.2-web/css/all.min.css" />
            </Head>
            <Header />
            <div id="content-wrap">
                <div className="row py-3">
                    <div className="col">
                        { props.children }
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};