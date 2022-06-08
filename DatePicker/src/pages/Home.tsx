import {
    IonIcon,
    IonLabel,
    IonContent,
    IonTabBar,
    IonTabButton,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonMenuButton,
    useIonViewWillEnter
} from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import { cafe, home, settings } from 'ionicons/icons';
import './Home.css';
import {Storage} from "@capacitor/storage";

const Home: React.FC = () => {
    const getBearer = async () => {
        const { value } = await Storage.get({ key: 'bearer' });
        return value;
    };

    useIonViewWillEnter(() => {
        getBearer().then((token)=>{
            if (token == null || token.length == 0) {
                window.location.href = "/settings";
            }
        });
    });
        return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
            <IonButtons>
                <IonMenuButton></IonMenuButton>
            </IonButtons>
            <IonTitle>WnTC</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
          <ExploreContainer />
      </IonContent>
    <IonTabBar slot="bottom">
        <IonTabButton tab="tab1" href="/list">
            <IonIcon icon={home} />
        </IonTabButton>
        <IonTabButton tab="tab2" href="/home">
            <IonIcon icon={cafe} />
        </IonTabButton>
        <IonTabButton tab="tab3" href="/settings">
            <IonIcon icon={settings} />
        </IonTabButton>
    </IonTabBar>
    </IonPage>
  );
};

export default Home;
