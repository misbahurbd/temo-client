import {
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
} from "react-hook-form";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ReactNode, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { Button } from "../ui/button";
import { ChevronDownIcon } from "lucide-react";
import { Matcher } from "react-day-picker";
import { format } from "date-fns";

type FormControlProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TTransformedValues = TFieldValues
> = {
  name: TName;
  label: ReactNode;
  description?: ReactNode;
  placeholder?: string;
  className?: string;
  required?: boolean;
  disabled?: boolean;
  control: ControllerProps<TFieldValues, TName, TTransformedValues>["control"];
  renderField?: FormRenderFieldProps<TFieldValues, TName, TTransformedValues>;
};

type FormBaseProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TTransformedValues = TFieldValues
> = FormControlProps<TFieldValues, TName, TTransformedValues> & {
  horizontal?: boolean;
  controlFirst?: boolean;
  children: (
    field: Parameters<
      ControllerProps<TFieldValues, TName, TTransformedValues>["render"]
    >[0]["field"] & {
      "aria-invalid": boolean;
      id: string;
    }
  ) => ReactNode;
  renderField?: FormRenderFieldProps<TFieldValues, TName, TTransformedValues>;
};

type FormRenderFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TTransformedValues = TFieldValues
> = ({
  field,
  fieldState,
}: {
  field: Parameters<
    ControllerProps<TFieldValues, TName, TTransformedValues>["render"]
  >[0]["field"];
  fieldState: Parameters<
    ControllerProps<TFieldValues, TName, TTransformedValues>["render"]
  >[0]["fieldState"];
}) => ReactNode;

type FormControlFunc<
  ExtraProps extends Record<string, unknown> = Record<never, never>
> = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TTransformedValues = TFieldValues
>(
  props: FormControlProps<TFieldValues, TName, TTransformedValues> & ExtraProps
) => ReactNode;

function FormBase<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TTransformedValues = TFieldValues
>({
  children,
  renderField,
  control,
  label,
  name,
  description,
  controlFirst,
  horizontal,
  className,
  required,
}: FormBaseProps<TFieldValues, TName, TTransformedValues>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const labelElement = (
          <>
            <FieldLabel htmlFor={field.name}>
              {label}
              {required && <span className="text-red-500">*</span>}
            </FieldLabel>
            {description && <FieldDescription>{description}</FieldDescription>}
          </>
        );
        const control = renderField
          ? renderField({ field, fieldState })
          : children({
              ...field,
              id: field.name,
              "aria-invalid": fieldState.invalid,
            });
        const errorElem = fieldState.invalid && (
          <FieldError errors={[fieldState.error]} />
        );

        return (
          <Field
            data-invalid={fieldState.invalid}
            orientation={horizontal ? "horizontal" : undefined}
            className={cn("gap-2", className)}
          >
            {controlFirst ? (
              <>
                {control}
                <FieldContent className="gap-1.5">
                  {labelElement}
                  {errorElem}
                </FieldContent>
              </>
            ) : (
              <>
                <FieldContent className="gap-1.5">{labelElement}</FieldContent>
                {control}
                {errorElem}
              </>
            )}
          </Field>
        );
      }}
    />
  );
}

export const FormInput: FormControlFunc = (props) => {
  return (
    <FormBase {...props}>
      {(field) => (
        <Input
          {...field}
          placeholder={props.placeholder}
          disabled={props.disabled}
        />
      )}
    </FormBase>
  );
};

export const FormTextarea: FormControlFunc = (props) => {
  return (
    <FormBase {...props}>
      {(field) => (
        <Textarea
          {...field}
          placeholder={props.placeholder}
          disabled={props.disabled}
        />
      )}
    </FormBase>
  );
};

export const FormSelect: FormControlFunc<{ children: ReactNode }> = ({
  children,
  ...props
}) => {
  return (
    <FormBase {...props}>
      {({ onChange, onBlur, ...field }) => (
        <Select {...field} onValueChange={onChange} disabled={props.disabled}>
          <SelectTrigger
            aria-invalid={field["aria-invalid"]}
            id={field.id}
            onBlur={onBlur}
            disabled={props.disabled}
          >
            <SelectValue
              placeholder={props.placeholder || "Select an option"}
            />
          </SelectTrigger>
          <SelectContent>{children}</SelectContent>
        </Select>
      )}
    </FormBase>
  );
};

export const FormCheckbox: FormControlFunc = (props) => {
  return (
    <FormBase {...props} horizontal controlFirst>
      {({ onChange, value, ...field }) => (
        <Checkbox
          {...field}
          checked={value}
          onCheckedChange={onChange}
          disabled={props.disabled}
        />
      )}
    </FormBase>
  );
};

export const FormDatePicker: FormControlFunc<{
  disabledDate?: Matcher | Matcher[] | undefined;
  format?: string;
}> = (props) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <FormBase {...props}>
      {(field) => (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id={field.name}
              disabled={props.disabled}
              className={cn(
                "w-48 justify-between font-normal",
                props.disabled && "cursor-not-allowed opacity-50",
                !field.value && "text-muted-foreground"
              )}
            >
              {field.value
                ? format(field.value, props.format || "MMM d, yyyy")
                : props.placeholder || "Select date"}
              <ChevronDownIcon className="size-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={field.value}
              onSelect={(date: Date | undefined) => {
                field.onChange(date);
                setIsOpen(false);
              }}
              disabled={props.disabledDate || undefined}
              className="w-full"
            />
          </PopoverContent>
        </Popover>
      )}
    </FormBase>
  );
};
