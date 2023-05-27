import {
  Autocomplete,
  FormControl,
  AutocompleteProps,
  TextField,
} from "@mui/material";
import { PropsWithChildren } from "react";

export interface FilterControlOption {
  id: number;
  name: string;
}

type Props<Options extends FilterControlOption> = Pick<
  AutocompleteProps<Options, false, false, false>,
  "multiple" | "value" | "onChange" | "disabled"
> & {
  name?: string;
  label: string;
  selected?: string[];
  options: Options[];
};

const labelID = () => `filter-control-${Date.now()}`;

export const FilterControl = <
  Options extends FilterControlOption = FilterControlOption
>(
  props: PropsWithChildren<Props<Options>>
) => {
  const domID = labelID();

  return (
    <FormControl>
      <Autocomplete
        autoHighlight
        id={domID}
        value={props.value}
        renderInput={(params) => <TextField {...params} label={props.label} />}
        options={props.options}
        disabled={props.disabled}
        getOptionLabel={(option) => option && option.name}
        onChange={props.onChange}
      />
    </FormControl>
  );
};
