import HanauLayout from "@/components/HanauLayout";
import { Footer } from "@/components/sections/Footer";
import { AddTrashBin } from "@/components/sections/AddTrashbin";

export default function TrashBin() {

  return (

    <HanauLayout breadcrumb="neuer Eimer">
      <AddTrashBin />
    </HanauLayout>

  );
}
