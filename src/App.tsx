import * as React from "react";
import { PostList, PostShow, PostCreate, PostEdit } from "./posts";
import { ActivityList, ActivityShow, ActivityCreate, ActivityEdit } from "./activities";
import { Admin, Resource } from "react-admin";
import {
    FirebaseDataProvider,
    FirebaseAuthProvider,
    RAFirebaseOptions
} from "react-admin-firebase";
import CustomLoginPage from './CustomLoginPage';

const config = require("./FIREBASE_CONFIG.js").firebaseConfig;

const options: RAFirebaseOptions = {
    logging: true,
    // rootRef: "root_collection/some_document",
    // watch: ["posts"]
};
const dataProvider = FirebaseDataProvider(config, options);
const authProvider = FirebaseAuthProvider(config, options);

class App extends React.Component {
    render() {
        return (
            <Admin
                loginPage={CustomLoginPage}
                dataProvider={dataProvider}
                authProvider={authProvider}>
                <Resource
                    name="activities"
                    list={ActivityList} show={ActivityShow} create={ActivityCreate} edit={ActivityEdit} />
                <Resource
                    name="posts"
                    list={PostList} show={PostShow} create={PostCreate} edit={PostEdit} />
            </Admin>
        );
    }
}

export default App;
