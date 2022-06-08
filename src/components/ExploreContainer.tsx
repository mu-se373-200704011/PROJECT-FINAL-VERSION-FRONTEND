import './ExploreContainer.css';
import {IonCard, IonCardHeader, IonCol, IonGrid, IonRow, IonSlide, IonSlides, useIonViewWillEnter} from "@ionic/react";

import React, {useState} from 'react';

import TinderCard from 'react-tinder-card'
import axios from "axios";
import { Storage } from "@capacitor/storage";

interface ContainerProps {
}

const ExploreContainer: React.FC<ContainerProps> = () => {
    const BE_URL = 'https://work-n-travel-coffees.herokuapp.com'
    const slideOpts = {
        initialSlide: 1,
        speed: 400
    };
    const shopsLoading = [
        {
            name: 'Fetching..',
            imageUrl: 'https://i.pinimg.com/originals/49/23/29/492329d446c422b0483677d0318ab4fa.gif',
            city: '',
            address: '',
            comments: []
        }
    ]
    const shopsError = [
        {
            name: 'Oops!',
            imageUrl: 'https://media.istockphoto.com/vectors/broken-robot-character-error-web-page-concept-vector-id921293258?k=20&m=921293258&s=170667a&w=0&h=5kk9tloH795XFR6XsxfCp6dBG9b9FkzA6qKMJ8Oar8c=',
            city: 'Houston, we have a problem',
            address: '',
            comments: []
        }
    ]

    const [lastDirection, setLastDirection] = useState()
    const [shops, setShops] = useState(shopsLoading)

    const getBearer = async () => {
        const { value } = await Storage.get({ key: 'bearer' });
        return value;
    };

    const getBookmarkList = async () => {
        const { value } = await Storage.get({ key: 'likedShops' });

        if (value == null) return JSON.parse("[]");

        try {
            return JSON.parse(value || "[]");
        } catch {
            return JSON.parse("[]");
        }
    };

    const setBookmarkList = async (value: any[]) => {
        await getBookmarkList().then((oldMarks: any)=>{

            if (!!oldMarks.find((element: any[]) => element == value)) return

            oldMarks.push(value);
            Storage.set({
                key: 'likedShops',
                value: JSON.stringify(oldMarks),
            });
        });
    };

    const getShopsApi = (auth_token: string): any => {
        let stat = false;
        axios.get(`${BE_URL}/shops/list/`,
            {headers: {"Access-Control-Allow-Origin": "*","Authorization": auth_token }}).then((res: any) => {
            if (res.status == 200) {
                setShops(res.data)
                console.log(res.data);
                stat = true;
            } else {
                setShops(shopsError);
            }
        }).catch((error: any) => {
            console.log(error)
        }).then(()=>{
            return stat;
        })
    }

    const setShopsApi = (i: number, auth_token: string) => {
        setTimeout(function() {
            let res = getShopsApi(auth_token);

            if (i < 10 && res == false) {
                setShopsApi(i+1, auth_token);
            } else {
                i = 10;
            }
        }, 600);
    }

    useIonViewWillEnter(() => {
        getBearer().then((auth_token)=>{
            if (auth_token != null) {
                setShopsApi(0, auth_token);
            } else {
                setShops(shopsError);
            }
        });
    });

    const swiped = async (direction: any, shop: any) => {
        if (direction == "right") {
            await setBookmarkList(shop);
        }
        setLastDirection(direction)
    }

    const outOfFrame = (name: any) => {
        return true;
        // console.log(name, ' left the screen!')
    }
    return (
        <IonGrid className={"ion-align-items-end vertical-align"}>
            <IonRow>
                <IonCol>
                    {shops.map((shop) =>
                        <div>
                            <TinderCard className='swipe' key={shop.name} onSwipe={(dir) => swiped(dir, shop)} onCardLeftScreen={() => outOfFrame(shop)}>
                                <div style={{ backgroundImage: "url('" + shop.imageUrl + "')" }} className='card'>
                                    <div className="bottomTextContainer">
                                        <h2 className="cardText">{shop.name}</h2>
                                        <p className="cardText">{shop.city}</p>
                                        <p className="cardText">{shop.address}</p>
                                    </div>
                                </div>
                                <br></br>
                                <IonSlides options={slideOpts}>
                                    { shop.comments.length == 0 &&
                                        <IonCard>
                                            <IonCardHeader></IonCardHeader>
                                            <IonCardHeader>No comments added yet.</IonCardHeader>
                                        </IonCard>
                                    }
                                    {shop.comments.map((comment) =>
                                        <IonSlide>
                                            <IonCard>
                                                <IonCardHeader>Baran</IonCardHeader>
                                                <IonCardHeader> {comment["text"]}</IonCardHeader>
                                            </IonCard>
                                        </IonSlide>
                                    )}
                                </IonSlides>
                            </TinderCard>
                        </div>
                    )}
                </IonCol>
                {lastDirection ? <h2 className='infoText'>You swiped {lastDirection}</h2> : <h2 className='infoText' />}
            </IonRow>
    </IonGrid>
  );
};

export default ExploreContainer;
