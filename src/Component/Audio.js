import React, { Component } from 'react'

import AudioReactRecorder, { RecordState } from 'audio-react-recorder'

import { Button } from '@react-md/button';
import Container from './Container';

import { Divider } from '@react-md/divider';
import { Typography, TextContainer } from '@react-md/typography';
import UploadHandler from './HandleUpload';
import {
    collection,
    getDocs,
    updateDoc,
    doc,
    serverTimestamp
} from "firebase/firestore";

import { db } from '../firebaseConfig';
import { Timestamp } from '@firebase/firestore'
import { query, where } from "firebase/firestore";


export class Audio extends Component {

    constructor(props) {
        super(props)

        this.state = {
            recordState: null,
            audioData: null,
            docs: null,
            recordTextId: null,
            recordText: null,
            blockedTime: 3600,
            n_tries_limit: 30,
            user_activity_id: null,
        }

    }


    selectText() {
        const userActivityRef = collection(db, "user-activity-record");
        let user_activity_data = {}

        const getActivityInfo = async () => {
            const uid = String(this.props.creds.uid)
            // console.log(uid);
            const q = query(userActivityRef,
                where("uid", "==", uid))

            const querySnapshotAct = await getDocs(q);
            // console.log(querySnapshotAct)
            if (querySnapshotAct.size !== 1) {
                alert('No user found while checking for text');
                return;
            }
            querySnapshotAct.forEach((doc) => {
                const data = doc.data()
                user_activity_data = {
                    id: doc.id,
                    isBlocked: data.is_blocked,
                    last_upload: data.last_upload,
                    last_try: data.last_try,
                    n_tries: data.n_tries,
                }
            });

            // console.log("user activity2", user_activity_data)

            if (user_activity_data.isBlocked) {
                // if the last try was more than the time
                // then remove the lock and block
                const timeDiff = (Timestamp.now().seconds - user_activity_data.last_upload.seconds)
                if (timeDiff > this.state.blockedTime) {
                    const userActivity = doc(
                        db, 
                        "user-activity-record", 
                        user_activity_data.id 
                    )

                    await updateDoc(userActivity, {
                        is_blocked: false,
                        n_tries: 0
                    });
                }
                else {
                    alert("The user is currently blocked")
                    return;
                }

            }
        }

        getActivityInfo();



        const textAudioMapRef = collection(db, "text-audio-map");
        const getText = async () => {
            const timeLimit = (Timestamp.now().seconds - 15 * 60)
            const compareTimeStamp = new Timestamp(timeLimit, 0)

            const q1 = query(textAudioMapRef,
                where("audio_filename", "==", ""),
                where("was_accessed", "==", false));
            const querySnapshot1 = await getDocs(q1);

            const q2 = query(textAudioMapRef,
                where("audio_filename", "==", ""),
                where("last_accessed", "<", compareTimeStamp));
            const querySnapshot2 = await getDocs(q2);

            let all_text = []

            querySnapshot1.forEach((doc) => {
                const data = doc.data()
                all_text.push({
                    data_id: doc.id,
                    text: data.text

                })

            });

            querySnapshot2.forEach((doc) => {
                const data = doc.data()
                all_text.push({
                    data_id: doc.id,
                    text: data.text

                })
            });
            var doc_size = all_text.length;
            if (doc_size > 0) {
                // console.log("docsize", doc_size);
                const selected_index = Math.floor(Math.random() * doc_size)
                // console.log("selected: ", selected_index)

                const selectedTextRef = doc(db, "text-audio-map", all_text[selected_index].data_id)

                await updateDoc(selectedTextRef, {
                    last_accessed: serverTimestamp(),
                    was_accessed: true
                });

                this.setState({
                    recordTextId: all_text[selected_index].data_id,
                    recordText: all_text[selected_index].text,
                    user_activity_id: user_activity_data.id, 
                });

                const userActivity = doc(
                    db, 
                    "user-activity-record", 
                    user_activity_data.id 
                )
                let isBlocked = ((user_activity_data.n_tries+1) === this.state.n_tries_limit)? true: false;

                await updateDoc(userActivity, {
                    is_blocked: isBlocked,
                    n_tries: user_activity_data.n_tries+1,
                    last_try: serverTimestamp(),
                });

                
            }
            else {
                alert("No text found")
                this.setState({
                    recordTextId: null,
                    recordText: null,
                })
            }


        };

        getText();
    }

    componentDidMount() {
        if (this.props.loggedIn)
            this.selectText();
        // console.log("component mounting");

    }

    start = () => {
        this.setState({
            recordState: RecordState.START
        })
    }

    pause = () => {
        this.setState({
            recordState: RecordState.PAUSE
        })
    }

    stop = () => {
        this.setState({
            recordState: RecordState.STOP
        })
    }

    onStop = (data) => {
        this.setState({
            audioData: data
        })
        // console.log('onStop: audio data', data)
    }

    upload = () => {

    }

    reset = () => {
        // console.log("reset");
        document.getElementsByTagName('audio')[0].src = '';
        this.setState({
            audioData: null,
            recordState: null,
            recordTextId: null,
            recordText: null,
        })
    }

    reload = () => {
        this.selectText()
    }

    render() {
        const { recordState } = this.state
        return (
            <div>
                <TextContainer >
                    <Typography>
                        <h3>Read out the following sentence after clicking start</h3>
                    </Typography>
                    <Divider />
                    <Typography>
                        <h2>{this.state.recordText}</h2>
                    </Typography>
                </TextContainer>

                <AudioReactRecorder
                    state={recordState}
                    onStop={this.onStop}
                    backgroundColor='rgb(255,255,255)'
                />
                <audio
                    id='audio'
                    controls
                    controlsList="nodownload"
                    src={this.state.audioData ? this.state.audioData.url : null}
                ></audio>

                <Container>
                    <Button theme="primary" themeType="contained" id='record' onClick={this.start}>
                        Start
                    </Button>
                    <Button id='pause' theme="primary" themeType="contained" onClick={this.pause}>
                        Pause
                    </Button>
                    <Button id='stop' theme="primary" themeType="contained" onClick={this.stop}>
                        Stop
                    </Button>

                    <Button id='reset' theme="primary" themeType="contained" onClick={this.reset}>
                        Reset
                    </Button>

                    <Button id='reset' theme="primary" themeType="contained" onClick={this.reload}>
                        Reload Text
                    </Button>
                </Container>

                <UploadHandler audioData={this.state.audioData} textId={this.state.recordTextId} uid={this.state.user_activity_id}> </UploadHandler>

            </div>
        )
    }
}

export default Audio




// const querySnapshot = await getDocs(textAudioMapRef);
// setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
// console.log(data.docs)
// this.setState({docs:data.docs})
// data.docs.map((doc) => {console.log(doc.data())})
// if (i===selected_index) {
//     this.setState({
//         recordText: data.text
//     })
// }
// i= i+1;
// console.log(`${doc.id} => ${data.text}, ${data.audio_filename}`)