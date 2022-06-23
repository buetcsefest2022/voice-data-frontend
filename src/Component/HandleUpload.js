import { useState } from "react";
import storage from "./../firebaseConfig";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import uuid from 'react-uuid'
import { Button } from '@react-md/button';
import { TextIconSpacing } from '@react-md/icon';
import { CloudUploadSVGIcon } from '@react-md/material-icons';
import {
    CircularProgress,
    getProgressA11y,
} from '@react-md/progress';

import { db } from '../firebaseConfig';
import {
    updateDoc,
    doc,
    serverTimestamp
} from "firebase/firestore";

import { useInterval } from '@react-md/utils';

import styles from './SimpleDeterminateExamples.module.scss';


function Container({ children }) {
    return <div className={styles.container}>{children}</div>;
}

function useDownloadInterval(delay = 100) {
    const [value, setValue] = useState(0);
    const [running, start] = useInterval((stop) => {
        const nextValue = Math.min(100, value + 1);
        if (value === nextValue) {
            stop();
        } else {
            setValue(nextValue);
        }
    }, delay);

    return {
        value,
        start,
        running,
    };
}

// function updateAudioName(audioId) {
//     const audioFileRef = doc(db, "text-audio-map", props.textId);

//     updateDoc(audioFileRef, {
//         audio_filename: id
//     });
// }

function UploadHandler(props) {
    // State to store uploaded file
    // const [file, setFile] = useState("");
    // progress
    const [percent, setPercent] = useState(0);

    const {
        value: value1,
        running: running1,
        start: start1,
    } = useDownloadInterval();

    // Handle file upload event and update state
    // function handleChange(event) {
    //     setFile(event.target.files[0]);
    // }



    const handleUpload = () => {
        if (!props.audioData) {
            alert("Audio Data is not present!");
            return;
        }

        if (!props.textId) {
            alert("Audio upload without reference text not allowed");
            return;
        }

        // const storageRef = ref(storage, `/${file.name}`);
        // var id = Math.random().toString(36).slice(2, 7);
        var id = uuid();

        id = id + ".wav";

        const storageRef = ref(storage, id);
        // const storageRef = ref(storage, "audio.wav");
        // progress can be paused and resumed. It also exposes progress updates.
        // Receives the storage reference and the file to upload.
        const uploadTask = uploadBytesResumable(storageRef, props.audioData.blob);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const percent = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );

                // update progress
                setPercent(percent);
            },
            (err) => console.log(err),
            () => {
                // download url
                getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                    // console.log(url);
                    const updateAudioFilename = async () => {
                        const audioFileRef = doc(db, "text-audio-map", props.textId);

                        await updateDoc(audioFileRef, {
                            audio_filename: id
                        });
                        alert("File Uploaded Successfully!")
                        const userActivity = doc(
                            db, 
                            "user-activity-record", 
                            props.uid
                        )
                        await updateDoc(userActivity, {
                            n_tries: 0,
                            last_upload: serverTimestamp(),
                        });
                    }

                    updateAudioFilename();

                });
            }
        );

    };

    return (
        <div>
            {/* <input type="file" onChange={handleChange} accept="audio/*" /> */}
            {/* <button onClick={handleUpload}>Upload to Firebase</button> */}
            {/* <p>{percent} "% done"</p> */}
            <Container>
                <Button
                    id="determinate-linear-example-toggle"
                    onClick={handleUpload}
                    theme="primary"
                    themeType="outline"
                    disabled={running1}
                    {...getProgressA11y('determinate-circular-progress', running1)}
                >
                    <TextIconSpacing icon={<CloudUploadSVGIcon />}>
                        Upload
                    </TextIconSpacing>
                </Button>
                <CircularProgress
                    id="determinate-circular-progress"
                    value={percent}
                    centered={false}
                    className={styles.circular}
                />
            </Container>

        </div>
    );


}

export default UploadHandler;