import HanauLayout from "@/components/HanauLayout";
import { AddTrashBin } from "@/components/sections/AddTrashBin";

export default function TrashBin() {

  return (

    <HanauLayout breadcrumb="neuer Eimer">
      <AddTrashBin />
    </HanauLayout>

  );
}
