"use client";
import { TagRes } from "@/common.type";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { http } from "@/lib/http";
import { cn, generateSlug } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CheckIcon,
  ChevronLeftIcon,
  Loader2Icon,
  LockIcon,
  PencilIcon,
  PlusIcon,
  SaveIcon,
  SearchIcon,
  TrashIcon,
  UnlockIcon,
} from "lucide-react";
import React, { useState } from "react";

const TagsPage = () => {
  const queryClient = useQueryClient();
  const [tagSelected, setTagSelected] = React.useState<TagRes | undefined>();
  const [searchKey, setSearchKey] = useState<string>("");
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [isEditSlug, setIsEditSlug] = React.useState<boolean>(false);
  const [isEditSlugCreate, setIsEditSlugCreate] =
    React.useState<boolean>(false);

  const [isOpenCreateTag, setIsOpenCreateTag] = useState<boolean>(false);
  const [form, setForm] = React.useState<Omit<TagRes, "id" | "_count">>({
    tagName: "",
    slug: "",
  });
  const handleOnchange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  React.useEffect(() => {
    setForm((prev) => ({ ...prev, slug: generateSlug(form.tagName) }));
  }, [form.tagName]);
  const [createForm, setCreateForm] = React.useState<
    Omit<TagRes, "id" | "_count">
  >({
    tagName: "",
    slug: "",
  });

  const handleOnchangeCreate = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCreateForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  React.useEffect(() => {
    setCreateForm((prev) => ({ ...prev, slug: generateSlug(prev.tagName) }));
  }, [createForm.tagName]);

  const tagQuery = useQuery({
    queryKey: ["tags"],
    queryFn: async () => {
      const { data } = await http.get<TagRes[]>("/tags");
      return data;
    },
  });

  React.useEffect(() => {
    if (tagSelected) {
      setForm({ tagName: tagSelected.tagName, slug: tagSelected.slug });
      setIsEditMode(false);
      setIsEditSlug(false);
    }
  }, [tagSelected]);

  const handleToggleEdit = () => {
    if (!isEditMode) {
      setIsEditMode(true);
    } else {
      if (
        tagSelected!.tagName === form.tagName &&
        tagSelected?.slug === form.slug
      ) {
        setIsEditMode(false);
      } else {
        tagUpdateMutation.mutate({ id: tagSelected!.id, data: form });
      }
    }
  };

  const tagDeleteMutation = useMutation({
    mutationFn: async (id: string) => await http.delete(`/tags/${id}`),
    onSettled() {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
    },
    onSuccess() {
      setTagSelected(undefined);
      toast({
        description: "🥳 Delete tag success",
      });
      setIsEditMode(false);
    },
    onError() {
      toast({
        description: "😟 Delete tag fail",
      });
    },
  });

  const tagCreateMutation = useMutation({
    mutationFn: async (form: Omit<TagRes, "id" | "_count">) => {
      const { data } = await http.post<TagRes>("/tags", createForm);
      return data;
    },
    onSettled() {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
    },
    onSuccess() {
      setCreateForm({ tagName: "", slug: "" });
      setIsOpenCreateTag(false);
      toast({
        description: "🥳 Create tag success",
      });
    },
    onError() {
      toast({
        description: "😟 Create tag fail",
      });
    },
  });

  const tagUpdateMutation = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Omit<TagRes, "id" | "_count">;
    }) => {
      await http.patch(`/tags/${id}`, data);
    },
    onSettled() {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
    },
    onSuccess() {
      toast({
        description: "🥳 Save tag success",
      });
      setIsEditMode(false);
      setTagSelected((prev) => ({ ...prev!, ...form }));
    },
    onError() {
      toast({
        description: "😟 Save tag fail",
      });
    },
  });

  const handleSubmitCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    tagCreateMutation.mutate(createForm);
  };

  const handleDialogState = (isOpen: boolean) => {
    setCreateForm({ tagName: "", slug: "" });
    setIsOpenCreateTag(isOpen);
    setIsEditSlugCreate(false);
  };

  return (
    <div className="flex border rounded-md overflow-hidden h-full">
      <div className="border-r w-[220px] h-full flex flex-col">
        <div className="flex items-center border-b p-2">
          <SearchIcon className="w-4 h-4 opacity-50" />
          <Input
            value={searchKey}
            onChange={(e) => setSearchKey(e.target.value)}
            placeholder="Search tag..."
            type="text"
            className="border-none focus-visible:ring-transparent ring-inset"
          />
        </div>
        <div className="flex flex-col gap-1 p-1 pl-2 h-full overflow-y-scroll">
          {!tagQuery.data ||
          tagQuery.data.length === 0 ||
          tagQuery.data.filter((t) =>
            searchKey.length === 0
              ? true
              : t.tagName.toLowerCase().includes(searchKey.toLowerCase())
          ).length === 0 ? (
            <p className="w-full text-center text-sm p-2">No result found</p>
          ) : (
            tagQuery.data
              ?.filter((t) =>
                searchKey.length === 0
                  ? true
                  : t.tagName.toLowerCase().includes(searchKey.toLowerCase())
              )
              .map((t) => (
                <div
                  onClick={() =>
                    setTagSelected((prev) =>
                      prev?.id === t.id ? undefined : t
                    )
                  }
                  key={t.id}
                  className={cn(
                    "flex items-center gap-1 p-2 rounded-md",
                    tagSelected === t ? "bg-accent" : "hover:bg-accent"
                  )}
                >
                  <CheckIcon
                    className={cn(
                      "h-4 w-4 flex flex-shrink-0",
                      tagSelected === t ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="overflow-hidden">
                    <p className="font-medium truncate">{t.tagName}</p>
                    <p className="text-xs truncate">{t.slug}</p>
                  </div>
                </div>
              ))
          )}
        </div>
      </div>

      <div className="flex flex-col flex-grow">
        <div className="flex items-center p-2 border-b min-h-[57px]">
          <h3 className="text-lg">Tag Detail</h3>
          <div className="flex gap-1 ml-auto">
            <Button
              disabled={
                form.slug !== tagSelected?.slug &&
                tagQuery.data?.map((t) => t.slug).includes(form.slug)
              }
              onClick={handleToggleEdit}
              variant="ghost"
              className={cn(
                "rounded-full w-10 h-10 p-2",
                tagSelected ? "" : "hidden"
              )}
            >
              {isEditMode ? (
                tagUpdateMutation.isPending ? (
                  <Loader2Icon className="w-4 h-4 animate-spin" />
                ) : (
                  <SaveIcon className="w-4 h-4" />
                )
              ) : (
                <PencilIcon className="w-4 h-4" />
              )}
            </Button>
            <Button
              onClick={() => {
                tagDeleteMutation.mutate(tagSelected!.id);
              }}
              variant="ghost"
              className={cn(
                "rounded-full w-10 h-10 p-2",
                tagSelected ? "" : "hidden"
              )}
            >
              <TrashIcon className="w-4 h-4" />
            </Button>

            <AlertDialog open={isOpenCreateTag}>
              <Button
                onClick={() => handleDialogState(true)}
                variant="ghost"
                className="rounded-full w-10 h-10 p-2"
              >
                <PlusIcon className="w-4 h-4" />
              </Button>
              <AlertDialogContent>
                <form onSubmit={handleSubmitCreate}>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Create new tag</AlertDialogTitle>
                  </AlertDialogHeader>

                  <div className="flex flex-col space-y-4">
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="tagName">Tag name</Label>
                      <Input
                        id="tagName"
                        name="tagName"
                        value={createForm.tagName}
                        onChange={handleOnchangeCreate}
                        className="focus-visible:ring-transparent "
                        placeholder="Tag name"
                      />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="slug">Slug</Label>
                      <div className="flex gap-2">
                        <Input
                          disabled={!isEditSlugCreate}
                          id="slug"
                          name="slug"
                          value={createForm.slug}
                          onChange={handleOnchangeCreate}
                          className={cn(
                            "focus-visible:ring-transparent",
                            tagQuery.data
                              ?.map((t) => t.slug)
                              .includes(createForm.slug)
                              ? "border-red-400"
                              : ""
                          )}
                          placeholder="Slug"
                        />
                        <Button
                          onClick={() => setIsEditSlugCreate((prev) => !prev)}
                          type="button"
                          variant="secondary"
                        >
                          {isEditSlugCreate ? (
                            <UnlockIcon className="w-4 h-4" />
                          ) : (
                            <LockIcon className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>

                  <AlertDialogFooter className="mt-4">
                    <AlertDialogCancel
                      onClick={() => handleDialogState(false)}
                      type="button"
                    >
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      type="submit"
                      disabled={
                        createForm.tagName.length === 0 ||
                        createForm.slug.length === 0 ||
                        tagQuery.data
                          ?.map((t) => t.slug)
                          .includes(createForm.slug)
                      }
                    >
                      Create
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </form>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        <div className="flex flex-col gap-4 p-4">
          {tagSelected ? (
            isEditMode ? (
              <>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="tagName">Tag name</Label>
                  <Input
                    value={form.tagName}
                    onChange={handleOnchange}
                    id="tagName"
                    name="tagName"
                    className="focus-visible:ring-transparent "
                    placeholder="Tag name"
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="slug">Slug</Label>
                  <div className="flex gap-2">
                    <Input
                      disabled={!isEditSlug}
                      value={form.slug}
                      onChange={handleOnchange}
                      id="slug"
                      name="slug"
                      className={cn(
                        "focus-visible:ring-transparent",
                        form.slug !== tagSelected.slug &&
                          tagQuery.data?.map((t) => t.slug).includes(form.slug)
                          ? "border-red-400"
                          : ""
                      )}
                      placeholder="Slug"
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => setIsEditSlug(!isEditSlug)}
                    >
                      {isEditSlug ? (
                        <UnlockIcon className="w-4 h-4" />
                      ) : (
                        <LockIcon className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    ID:
                  </p>
                  <p className="text-muted-foreground">{tagSelected?.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    NAME:
                  </p>
                  <p className="text-muted-foreground">
                    {tagSelected?.tagName}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    SLUG
                  </p>
                  <p className="text-muted-foreground">{tagSelected?.slug}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    POST
                  </p>
                  <p className="text-muted-foreground">
                    {tagSelected?._count.post}
                  </p>
                </div>
              </>
            )
          ) : (
            <div className="p-2 text-center">No selected</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TagsPage;
