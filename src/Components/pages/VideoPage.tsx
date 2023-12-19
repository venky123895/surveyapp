import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  Box,
  Flex,
  Heading,
  Input,
  Stack,
  Text,
  FormControl,
  FormLabel,
  Textarea,
  Button,
  useToast,
  VStack,
} from "@chakra-ui/react";

import { FaCloudUploadAlt } from "react-icons/fa";
import { addVideos } from "../features/redux/dataSlice";

export interface dataType {
  id: string;
  title: string;
  description: string;
  images: any;
}

const VideoUpload: React.FC = () => {
  const dispatch = useDispatch();
  const toast = useToast();

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [videoUploaded, setvideoUploaded] = useState<boolean>(false);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [videoPreviews, setVideoPreviews] = useState<
    { url: string; name: string }[]
  >([]);

  const handleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    setSelectedFiles(files);

    if (files && files.length > 0) {
      if (files.length > 1) {
        toast({
          title: "You can only select up to 1 Video.",
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
        e.target.value = "";
        setvideoUploaded(false);
        setVideoPreviews([]);
        return;
      }

      const allowedTypes = [
        "video/mp4",
        "video/x-m4v",
        "video/webm",
        "video/*",
      ];
      const previews: { url: string; name: string }[] = [];

      for (let i = 0; i < files.length; i++) {
        if (!allowedTypes.includes(files[i].type)) {
          toast({
            title: "Please select only video files (mp4, x-m4v etc..).",
            status: "warning",
            duration: 3000,
            isClosable: true,
          });
          e.target.value = "";
          setvideoUploaded(false);
          setVideoPreviews([]);
          return;
        }
        const previewURL = URL.createObjectURL(files[i]);
        previews.push({ url: previewURL, name: files[i].name });
      }
      setVideoPreviews(previews);
      setvideoUploaded(true);
    }
  };
  const handleSubmit = () => {
    if (title.trim() === "") {
      toast({
        title: "Title should not be empty",
        description: "Enter Title",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    if (description.trim() === "") {
      toast({
        title: "Description should not be empty",
        description: "Enter Description",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!videoUploaded) {
      toast({
        title: "Upload Video",
        description: "Video Not Uploaded",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const data: dataType = {
      id: new Date().getTime().toString(),
      title: title,
      description: description,
      images: selectedFiles,
    };

    dispatch(addVideos(data));

    toast({
      title: "Video Uploaded Successfully",
      description: "Please check in home page",
      status: "success",
      duration: 3000,
      isClosable: true,
    });

    setVideoPreviews([]);
    setSelectedFiles(null);
    setTitle("");
    setDescription("");
    setvideoUploaded(false);
  };

  const handleRemove = () => {
    setVideoPreviews([]);
    setSelectedFiles(null);
    setvideoUploaded(false);
  };

  return (
    <Box p={6} borderWidth={3} borderRadius="md" borderColor="blue.500">
      <Flex flexDirection={["column", "column", "row"]} justify="space-around">
        <Stack spacing={4} align="center">
          <FaCloudUploadAlt
            data-testid="uploadlogo"
            fontSize="2em"
            color="gray.500"
          />
          <Heading as="h3" size="md">
            Upload Files
          </Heading>
          <Input
            type="file"
            id="fileInput"
            display="none"
            onChange={(e) => handleImages(e)}
            accept="video/mp4,video/x-m4v,video/*"
            placeholder="Enter files"
          />
          <label htmlFor="fileInput">
            <Box
              as="span"
              cursor="pointer"
              borderWidth={1}
              borderRadius="md"
              p={2}
              borderColor="blue.500"
              _hover={{ color: "black", bg: "white", fontWeight: "600" }}
            >
              Choose a file
            </Box>
          </label>
          <VStack>
            {videoPreviews.length > 0 && (
              <>
                <video
                  width="100px"
                  height="70px"
                  style={{ borderRadius: "10px" }}
                >
                  <source src={videoPreviews[0]?.url} />
                </video>
                <Button bg="red.500" onClick={handleRemove}>
                  Remove Video
                </Button>
              </>
            )}
          </VStack>
          <Text fontSize="sm" color="gray.500">
            Supported file types: MP4, X-m4v, Video/*
          </Text>
        </Stack>
        <Stack>
          <FormControl>
            <FormLabel>Enter Title</FormLabel>
            <Input
              type="text"
              placeholder="Enter Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <FormLabel>Enter Description</FormLabel>
            <Textarea
              placeholder="Enter Description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></Textarea>
            <Button w="100%" mt="10px" onClick={handleSubmit}>
              Submit
            </Button>
          </FormControl>
        </Stack>
      </Flex>
    </Box>
  );
};

export default VideoUpload;
