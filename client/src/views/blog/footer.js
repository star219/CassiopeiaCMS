import React, { Component } from 'react';

class footer extends Component {

    render() {
        return (
            <footer className="footer" style={{ backgroundColor: '#222227', color: '#ffffff', padding: '1.5%', paddingTop: '10%' }}>
                <div className="columns">
                    <div className="column has-text-centered">
                        <p style={{ fontWeight: 400, fontSize: "calc(12px + 0.4vh)", color: '#aaaaaa' }}>
                            Content & Graphics © 2020 AzizStark
                        </p>
                    </div>
                </div>
            </footer>
        )
    }

}

export default footer;