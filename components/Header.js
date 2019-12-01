import React from 'react';
import { Menu } from 'semantic-ui-react';
import { Link } from '../routes';

export default () => {
    return (
        <header className="header">
            <div className="row">
                <div className="col">
                    <a><img src='/images/logo.svg' className="logo" alt="logo"/></a>
                    <Menu style={{ marginTop: '10px' }}>
                        <Menu.Menu position="left">
                            <Link route= "/">
                                <a className="item">
                                    Home
                                </a>
                            </Link>
                            <Link route= "/cry/buy">
                                <a className="item">
                                    Buy CRY
                                </a>
                            </Link>
                            <Link route= "/pools/new">
                                <a className="item">
                                    Search
                                </a>
                            </Link>
                        </Menu.Menu>
                    </Menu>
                </div>
            </div>
        </header>
        
    );
}; 