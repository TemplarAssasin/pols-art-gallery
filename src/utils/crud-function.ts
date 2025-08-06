//Contains the CRUD function of the web app

import { supabase } from "@/src/supabase/supabaseClient";
import { FormState, GalleryItem, PopCardInfo } from "../types/variable-types";
import toast from 'react-hot-toast'


// DATA INSERTION TO SUPABASE

export function handleChange( // DYNAMICALLY ASSIGNING AND STORING INPUT VALUES FROM THE FORM
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    setForm: React.Dispatch<React.SetStateAction<FormState>>
) {
    const { id, value, files } = e.target as HTMLInputElement;

    if (files) {
        setForm(prev => ({
            ...prev,
            file: files[0],
            fileName: files[0].name
        }));
    } else {
        setForm(prev => ({
            ...prev,
            [id]: value
        }));
    }
}



export async function handleSubmit( // INSERTING DATA TO SUPABASE
    e: React.FormEvent,
    form: any,
    setForm: React.Dispatch<React.SetStateAction<FormState>>,
    fileInputRef?: React.RefObject<HTMLInputElement | null>,
    setState?: React.Dispatch<React.SetStateAction<boolean>>,
) {
    e.preventDefault();

    const { title, description, date, file } = form;

    if (!title || !date || !description || !file) {
        toast.error("Please fill out all the fields.");
        return;
    }

    const filePath = `${Date.now()}-${file.name}`; // GENERATING A UNIQUE NAME FOR THE IMAGE AND STORING IT TO SUPABASE BUCKET
    const { error: uploadError } = await supabase
        .storage
        .from('artwork-images')
        .upload(filePath, file);

    if (uploadError) {
        toast.error(`Uploading failed: ${uploadError.message}`);
        return;
    }

    const { publicUrl } = supabase // GETTING THE GENERATED URL OR IMAGE FILE NAME
        .storage
        .from('artwork-images')
        .getPublicUrl(filePath).data;

    const { data: {user}, error:authError } = await supabase.auth.getUser();

    if (authError){
        toast.error("Failed to fetch data. Not authenticated user.");
        return [];
    }

    const { error: insertError } = await supabase //ACTUAL INSERTION OF DATA TO SUPABASE
        .from('gallery')
        .insert({ title, description, date, image_url: publicUrl, email: user?.email });

    if (insertError) {
        toast.error(`Insert failed: ${insertError.message}`);
        return;
    }

    toast.success("Successfully uploaded!");
     if (fileInputRef?.current) {
    fileInputRef.current.value = ""; 
    }
    setForm({ // RESETS THE FORM AFTER SUCCESSFUL INSERTION
        title: "",
        date: "",
        description: "",
        file: null,
        fileName: "Upload File"
    });
    setState?.(false)
}


// DATA RETRIEVAL OR READING OF DATA FROM DATABASE
export async function fetchGalleryData(): Promise<GalleryItem[]> { // RETRIEVING DATA FROM SUPABASE

    const { data: {user}, error:authError } = await supabase.auth.getUser();

    if (authError){
        toast.error("Failed to fetch data. Not authenticated user.");
        return [];
    }

    const { data, error: fetchError } = await supabase // FETCHING TO SUPABASE
        .from('gallery')
        .select('*')
        .eq('email', user?.email)
        .order('date', { ascending: false });

    if (fetchError) {
        toast.error(`Failed to fetch data: ${fetchError.message}`);
        return [];
    }

    return data as GalleryItem[]; // POPULATING AN EMPTY ARRAY FROM THE RETRIEVED DATA
}




export async function uploadImageAndGetUrl(file: File):Promise<string | null> { // GENERATING UNIQUE IMAGE_URL AND UPLOADING IMAGE TO SUPABASE BUCKET
    const filePath = `${Date.now()}-${file.name}`;
    const { error:uploadError } = await supabase.storage.from('artwork-images').upload(filePath,file);
    if (uploadError) {
        console.error(`Upload Failed. Error: ${uploadError.message}`);
        return null;
    }

    const { publicUrl } = supabase.storage.from('artwork-images').getPublicUrl(filePath).data;
    return publicUrl;
}

// UPDATING OF DATARECORDS IN SUPABASE
export async function updateRecord( 
    id: number,
    data: PopCardInfo,
    newFile?: File | null
    ): Promise<{ success: boolean; error?: string }> {
    try {
        let newImageUrl: string | null = null;

        if (newFile) {
        const { data: existingRecord, error: fetchError } = await supabase //CHECKS IF THE RECORD EXISTS
            .from('gallery')
            .select('image_url')
            .eq('id', id)
            .single();

        if (fetchError || !existingRecord) {
            return { success: false, error: fetchError?.message || 'Record not found' };
        }

        const oldUrl = existingRecord.image_url; // IF EXIST ACCESS THE UNIQUE IMAGE ORL
        const bucketName = 'artwork-images';
        const oldPath = oldUrl.split(`/object/public/${bucketName}/`)[1];

        if (oldPath) { // AUTOMATES THE DELETION OF IMAGE FROM THE SUPABASE BUCKET UPON UPDATING IMAGE FILE
            const { error: deleteError } = await supabase
            .storage
            .from(bucketName)
            .remove([oldPath]);

            if (deleteError) {
            return { success: false, error: `Failed to delete old image: ${deleteError.message}` };
            }
        }

        newImageUrl = await uploadImageAndGetUrl(newFile);
        if (!newImageUrl) {
            return { success: false, error: 'Image upload failed' };
        }
        }

        const updatedData = Object.fromEntries( // FILTERS ALL NULL VALUES AND UPDATES ONLY THE ONE WITH VALUE 
        Object.entries(data).filter(([_, value]) => value !== "")
        );

        if (newImageUrl) {
        updatedData.image_url = newImageUrl;
        }

        const { error: updateError } = await supabase // UPDATES THE RECORD BASE ON THE UNIQUE ID
        .from('gallery')
        .update(updatedData)
        .eq('id', id);

        if (updateError) {
        return { success: false, error: updateError.message };
        }

        return { success: true };
    } catch (err) {
        return { success: false, error: 'Unexpected error occurred.' };
    }
    }


// DELETION OF DATA IN SUPABASE
export async function handleDelete(id: number): Promise<void> { 

    const { data:record, error: fetchError } = await supabase.from('gallery').select('image_url').eq('id', id).single(); // RETRIEVE THE IMAGE_URL

    if (fetchError || !record) {
        toast.error(`Failed to fetch image_url. Error  ${fetchError?.message || 'Not found'}`)
        return;
    }

    const fullUrl = record.image_url;
    const bucketName = 'artwork-images';
    const path = fullUrl.split(`/object/public/${bucketName}/`)[1]; // EXTRACTING THE NAME 

    if (path) { // ACTUAL REMOVAL OF IMAGE FROM THE BUCKET
        const { error:storageError } = await supabase.storage.from('artwork-images').remove([path])
        if (storageError){
        toast.error(`Failed to delete image: ${storageError.message}`);
        return;
        }
    }
    
    const { error: deleteError } = await supabase  // DELETION OF THE WHOLE ARTWORK DATA
        .from('gallery')
        .delete()
        .eq('id', id);

    if (deleteError) {
        toast.error(`Failed to delete: ${deleteError.message}`);
    } else {
        toast.success("Successfully deleted.");
    }
}
