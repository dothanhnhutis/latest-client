"use client";
import React from "react";
import {
  ChevronLeftIcon,
  LockIcon,
  PencilIcon,
  PlusIcon,
  SaveIcon,
  TrashIcon,
  UnlockIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter, usePathname } from "next/navigation";
import { cn, generateSlug } from "@/lib/utils";
import { useToast } from "./ui/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { CreateTagInputType } from "@/constants/schema";
import { getSession, useSession } from "next-auth/react";
import { http } from "@/lib/http";

const TagHeader = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [open, setOpen] = React.useState<boolean>(false);
  const [editable, setEditable] = React.useState(false);
  const [errorSlug, setErrorSlug] = React.useState(false);
  const [isEdit, setIsEdit] = React.useState<boolean>(false);

  const router = useRouter();
  const pathName = usePathname();
  const id = React.useMemo(() => {
    return pathName.split("/")[3];
  }, [pathName]);

  const [form, setForm] = React.useState<{
    name: string;
    slug: string;
  }>({
    name: "",
    slug: "",
  });

  React.useEffect(() => {
    setErrorSlug(false);
  }, [form]);

  React.useEffect(() => {
    setForm((prev) => ({
      ...prev,
      slug: generateSlug(prev.name),
    }));
  }, [form.name]);

  return (
    <div className="flex items-center p-2 border-b min-h-[57px]">
      <Button
        onClick={() => router.push("/manager/tags")}
        variant="ghost"
        className={cn("h-8 w-8 p-0 mr-2", id ? "" : "hidden")}
      >
        <ChevronLeftIcon className="h-5 w-5" />
      </Button>
      <h3 className="text-lg">Tag Detail</h3>
      <div className="flex gap-1 ml-auto">
        <Button
          variant="ghost"
          className={cn("rounded-full w-10 h-10 p-2", id ? "" : "hidden")}
        >
          {isEdit ? (
            <SaveIcon className="w-4 h-4" />
          ) : (
            <PencilIcon className="w-4 h-4" />
          )}
        </Button>
        <Button
          variant="ghost"
          className={cn("rounded-full w-10 h-10 p-2", id ? "" : "hidden")}
        >
          <TrashIcon className="w-4 h-4" />
        </Button>
        <TagAddBtn />
      </div>
    </div>
  );
};

const TagAddBtn = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [open, setOpen] = React.useState<boolean>(false);
  const [editable, setEditable] = React.useState(false);
  const [errorSlug, setErrorSlug] = React.useState(false);

  const [form, setForm] = React.useState<CreateTagInputType>({
    name: "",
    slug: "",
  });

  React.useEffect(() => {
    setErrorSlug(false);
  }, [form]);

  React.useEffect(() => {
    setForm((prev) => ({
      ...prev,
      slug: generateSlug(prev.name),
    }));
  }, [form.name]);

  const tagCreateMutation = useMutation({
    mutationFn: async () => {
      const { data } = await http.post<{
        id: string;
        name: string;
        slug: string;
      }>("/tags", form);
      return data;
    },
    onError(error) {
      setErrorSlug(true);
      toast({
        description: "😟 Slug has been used",
      });
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["tags"], exact: true });
      setOpen(false);
      setForm({
        name: "",
        slug: "",
      });
      toast({
        description: "🥳 Create tag success",
      });
    },
  });

  const handleOnchange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    tagCreateMutation.mutate();
  };
  return (
    <AlertDialog open={open}>
      <Button
        onClick={() => setOpen(true)}
        variant="ghost"
        className="rounded-full w-10 h-10 p-2"
      >
        <PlusIcon className="w-4 h-4" />
      </Button>
      <AlertDialogContent>
        <form onSubmit={handleSubmit}>
          <AlertDialogHeader>
            <AlertDialogTitle>Create new tag</AlertDialogTitle>
          </AlertDialogHeader>

          <div className="flex flex-col space-y-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Tag name</Label>
              <Input
                id="name"
                name="name"
                value={form.name}
                onChange={handleOnchange}
                className="focus-visible:ring-transparent "
                placeholder="Tag name"
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="slug">Slug</Label>
              <div className="flex gap-2">
                <Input
                  disabled={!editable}
                  id="slug"
                  name="slug"
                  value={form.slug}
                  onChange={handleOnchange}
                  className={cn(
                    "focus-visible:ring-transparent",
                    errorSlug ? "border-red-400" : ""
                  )}
                  placeholder="Slug"
                />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setEditable(!editable)}
                >
                  {editable ? (
                    <UnlockIcon className="w-4 h-4" />
                  ) : (
                    <LockIcon className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>

          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel type="button" onClick={() => setOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              type="submit"
              disabled={form.name.length === 0 || form.slug.length === 0}
            >
              Create
            </AlertDialogAction>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default TagHeader;
