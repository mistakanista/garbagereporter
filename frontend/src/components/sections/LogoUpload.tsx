import { Label } from "@/components/ui/label";
import { useDropzone } from "react-dropzone";
import { Image } from "lucide-react";

export const LogoUpload = ({ formData, setFormData }) => {

  const onDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];

    const data = new FormData();
    data.append("file", file);

      const res = await fetch("/api/report/upload/image", {
      method: "POST",
      body: data,
    });

    const result = await res.json();
    console.log("Upload result:", result);

    setFormData({
      ...formData,
      image: result.filename
    });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
  });

  return (
    <div className="space-y-2">
      <Label className="flex items-center gap-2">
        <Image size={16} />
        Logo *
      </Label>

      <div
        {...getRootProps()}
        className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-muted"
      >
        <input {...getInputProps()} />

        {isDragActive ? (
          <p>Bild hier ablegen ...</p>
        ) : (
          <p>Bild hier ablegen oder hochladen</p>
        )}
      </div>

      {formData.image && (
        <img
          src={`http://localhost:8010/reports/${formData.image}`}
          className="h-16 mt-2 object-contain"
        />
      )}
    </div>
  );
};