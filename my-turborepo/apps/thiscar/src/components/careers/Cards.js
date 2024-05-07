import React from "react";
import "../../contents/scss/cards.scss";
import Card from "./Card";

function Cards(props) {
    return (
        <div className="container-fluid  m-0 row bg-grey-career pt-5 h-100 careers">
            <div className="col-lg-4">
                <div className="card card_career bg-yellow">
                    <div className="card-body">
                        <h5 className="card-title">{props.cards.heading}</h5>
                        <div className="row">
                            <div className="col-lg-12 col-md-6 col-sm-12">
                                <p className="card-text">{props.cards.description}</p>
                            </div>

                            <div className="col-lg-12 col-md-6 col-sm-12">
                                <ul className="card-list">
                                    <li>
                                        <p>{props.cards.subText1}</p>
                                    </li>
                                    <li>
                                        <p>{props.cards.subText2}</p>
                                    </li>
                                    <li>
                                        <p>{props.cards.subText3}</p>
                                    </li>
                                    <li>
                                        <p>{props.cards.subText4}</p>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {props.card && <Card jobInformation={props.card} />}
        </div>
    );
}

export default Cards;
