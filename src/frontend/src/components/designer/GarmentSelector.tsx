import { useDesignerState } from '../../state/useDesignerState';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function GarmentSelector() {
  const { garmentType, setGarmentType } = useDesignerState();

  return (
    <Select value={garmentType} onValueChange={setGarmentType}>
      <SelectTrigger className="w-[140px]">
        <SelectValue placeholder="Garment" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="tshirt">T-Shirt</SelectItem>
        <SelectItem value="hoodie">Hoodie</SelectItem>
        <SelectItem value="cap">Cap</SelectItem>
      </SelectContent>
    </Select>
  );
}
