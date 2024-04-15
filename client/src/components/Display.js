import { useState } from "react";
import './Display.css';
const Display = ({ account, contract }) => {
    const [data, setdata] = useState();//contains all the images that need to be displayed
    const getData = async () => {
        // let dataArray;
        //if user has entered some other address, then display that address's files. Otherwise, display this user's files.

        const dataArray = await contract.viewOwnedFiles();
        const isEmpty = Object.keys(dataArray).length === 0;//Object lets you use all the properties and functions belonging to objects in js.
        if (!isEmpty)//if there are some file urls pertaining to this address
        {
            const str = dataArray.toString();//converts all the objects to a concatenated string(joined by comma)
            const str_array = str.split(",");
            //map the files to individual elements to be displayed
            const images = str_array.map((item, i) => {
                const arr = item.split('$');
                const url = arr[0];
                const fileName = arr[1];
                return (<a href={url} key={i} target="_blank" rel="noreferrer">
                    {fileName}
                </a>);
            })
            setdata(images);
        }
        else {
            alert("No files to Display !");
        }
    }
    return <>

        <input type="text" placeholder="Enter Address" className='address' />
        <button className="center button" onClick={getData}>Get Data</button>
        <div className="image-list">
            {data}
        </div>
    </>;
}
export default Display;