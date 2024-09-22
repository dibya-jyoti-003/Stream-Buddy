import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import app from '../firebase.js'
import {url} from '../App.jsx'


const Container = styled.div`
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background-color: #00000096;
    display: flex;
    align-items: center;
    justify-content: center;
`
const Wrapper = styled.div`
    width: 600px;
    height: 600px;
    background-color: ${({theme}) => theme.bgLighter};
    color: ${({theme}) => theme.text};
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    position: relative;
`
const Close = styled.div`
    position: absolute;
    top: 10px;
    right: 10px;
    cursor: pointer;
`
const Title = styled.h1`
    text-align: center;
`

const Input = styled.input`
    border: 1px solid ${({theme}) => theme.soft};
    color: ${({theme}) => theme.text};
    border-radius: 3px;
    padding: 10px;
    background-color: transparent;
`

const Desc = styled.textarea`
    border: 1px solid ${({theme}) => theme.soft};
    color: ${({theme}) => theme.text};
    border-radius: 3px;
    padding: 10px;
    background-color: transparent;
`
const Button = styled.button`
  border-radius: 3px;
  border: none;
  padding: 10px 20px;
  font-weight: 500;
  cursor: pointer;
  background-color: ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.textSoft};
`;
const Label = styled.label`
  font-size: 14px;
`;

export default function Upload({setOpen}) {

    const [img,setImg] = useState(undefined)
    const [video,setVideo] = useState(undefined)
    const [imgPerc,setImgPerc] = useState(0)
    const [videoPerc,setVideoPerc] = useState(0)
    const [inputs,setInputs] = useState({})
    const [tags,setTags] = useState([])

    const navigate = useNavigate()
    const axiosInstance = axios.create({
        baseURL: `${url}`, // Base URL for your backend API
        withCredentials: true, // Enable cookies
    })

    const handleChange = (e) => {
        setInputs(prev => {
            console.log(`e.target.name -> ${e.target.name}`)
            return {...prev, [e.target.name]:e.target.value}
        })
    }

    const handleTags = (e) => {
        setTags(e.target.value.split(','))
    }

    const uploadFile = (file, urlType) => {

            const storage = getStorage(app);
            const fileName = new Date().getTime() + file.name
            const storageRef = ref(storage,fileName);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on('state_changed',(snapshot) => {
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            urlType === 'thumbnail' ? setImgPerc(progress) : setVideoPerc(progress)
            switch (snapshot.state) {
            case 'paused':
                console.log('Upload is paused');
                break;
            case 'running':
                console.log('Upload is running');
                break;
            default:
                break;
            }
        }, 
        (error) => {}, 
        () => {
            // Upload completed successfully, now we can get the download URL
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                setInputs(prev => {
                return {...prev, [urlType]:downloadURL }
                })
            });
        }
        );

    }

    useEffect(()=>{video && uploadFile(video,'videoUrl')},[video])

    useEffect(()=>{img && uploadFile(img,'thumbnail')},[img])

    const handleUpload = async (e)=>{
        e.preventDefault()
        const res = await axiosInstance.post(`${url}videos/add`,{...inputs,tags})
        setOpen(false)
        //console.log(res)
        res.status === 200 && navigate(`${url}videos/${res.data._id}`)
    }


  return (
    <Container>
        <Wrapper>
            <Close onClick={()=>setOpen(false)}>X</Close>
            <Title>Upload a new video</Title>
            <Label>Video: </Label>
            {videoPerc > 0? (
                "Uploading"+videoPerc+" %"
            ) : (
                <Input 
            type="file" 
            accept = 'video/*' 
            onChange={(e) => setVideo(e.target.files[0])} 
            />
            )}
            <Label>Title: </Label>
            <Input 
            type="text" 
            placeholder='Title' 
            name='title' 
            onChange={handleChange} />

            <Desc 
            type='text' 
            name='description' 
            placeholder='Description' 
            rows={8} 
            onChange={handleChange} />

            <Label>Image: </Label>

            <Input 
            type="text" 
            placeholder='Separate the tags with comma...' 
            onChange={handleTags}/>

            {imgPerc > 0? (
                "Uploading" + imgPerc +' %'
                ):(
                <Input 
                type = "file" 
                accept='image/*' 
                onChange={(e) => setImg(e.target.files[0])} 
                />
            )}
            <Button onClick={handleUpload}>Upload</Button>
        </Wrapper>
    </Container>
  )
}
