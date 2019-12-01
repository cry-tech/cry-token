import React from 'react';
import { Menu } from 'semantic-ui-react';
import { Link } from '../routes';
import { relative } from 'path';

export default () => {
    return (
        <footer className="footer pt-5">
            <div className="row">
                <div className="col-md-3 mt-md-0 mt-3  text-center">
                    <a href="https://mining.crytech.trade/index.html" className="g-text-center--xs">
                        <img className="img-responsive mb-4" src="/images/HeaderLogo-shrink.svg" alt="" />
                    </a>
                </div>
                <div className="col-md-6 mb-md-0 mb-3 text-center">                                
                    <a href="https://twitter.com/crytechmining" target="_blank"><i className="fab fa-twitter so-icon"></i></a>
                    <a href="https://t.me/CrytechMining" target="_blank"><i className="fab fa-telegram-plane so-icon"></i></a>
                    <a href="https://www.linkedin.com/company/cry-tech/" target="_blank"><i className="fab fa-linkedin so-icon"></i></a>
                    <a href="https://www.instagram.com/crytech_mining/" target="_blank"><i className="fab fa-instagram so-icon"></i></a>
                    <a href="https://www.facebook.com/crytechmining" target="_blank"><i className="fab fa-facebook so-icon"></i></a>
                </div>
                <div className="col-md-3 mb-md-0 mb-3 text-center">
                    <h5 className="text-uppercase">Links</h5>
                    <ul className="list-unstyled">
                        <li>
                            <a href="https://mining.crytech.trade/About.html">About</a>
                        </li>
                        <li>
                            <a href="https://mining.crytech.trade/Contact.html" className="">Contact</a>
                        </li>
                        <li>
                            <a href="https://mining.crytech.trade/FAQ.html" className="">FAQ</a>
                        </li>
                        <li>
                            <a href="https://mining.crytech.trade/white-paper.pdf" className="">White Paper</a>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="footer-copyright text-center py-3">© 2019 Copyright : 
                <a href="https://mining.crytech.trade/">mining.crytech.trade</a>
            </div>
        </footer>
    );
}; 

