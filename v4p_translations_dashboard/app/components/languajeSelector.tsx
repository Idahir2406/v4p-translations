import { useQuery } from "@tanstack/react-query";
import { languajesService } from "~/services/languajesService";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";


interface LanguajeSelectorProps extends React.ComponentProps<typeof Select>{
  value: string;
  onChange: (value: string) => void;
}

export const LanguajeSelector = (props: LanguajeSelectorProps) => {
  const { data, isLoading } = useQuery({
    queryKey: ["languages"],
    queryFn: () => languajesService.getAll(),
  });
  if (isLoading) return <div>Loading...</div>;
  if (!data) return <div>No data</div>;
  return (
    <Select value={props.value} onValueChange={props.onChange}>
      <SelectTrigger className="w-36">
        <SelectValue placeholder="Select a language" />
      </SelectTrigger>
      <SelectContent>
        {data.map((language) => (
          <SelectItem key={language.id} value={language.code}>{language.name}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
