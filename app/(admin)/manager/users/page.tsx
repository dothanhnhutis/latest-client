"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Skeleton } from "@/components/ui/skeleton";
import { cn, compareObject, isBase64DataURL } from "@/lib/utils";
import {
  CheckIcon,
  ChevronLeftIcon,
  Loader2Icon,
  LockIcon,
  PencilIcon,
  PlusIcon,
  SaveIcon,
  SearchIcon,
} from "lucide-react";
import React from "react";
import { PiEyeBold, PiEyeClosedBold } from "react-icons/pi";
import AvatarDefault from "@/images/user-1.jpg";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ImageRes, Role, UserRes } from "@/common.type";
import { http } from "@/lib/http";
import { UserCreateInput, editUserSchema, roles } from "@/constants/schema";
import { toast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";

const UserPage = () => {
  const queryClient = useQueryClient();
  const [searchKey, setSearchKey] = React.useState<string>("");
  const [userSelected, setUserSelected] = React.useState<UserRes | undefined>();
  const [isOpenCreateUser, setIsOpenCreateUser] =
    React.useState<boolean>(false);
  const [isEditMode, setIsEditMode] = React.useState<boolean>(false);
  const [isHiddenPassword, setIsHiddenPassword] =
    React.useState<boolean>(false);
  const { data: users } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data } = await http.get<UserRes[]>("/users");
      return data;
    },
  });

  const [form, setForm] = React.useState<UserRes>({
    id: "",
    email: "",
    isActive: true,
    role: "Writer",
    username: "",
    bio: "",
    phone: "",
    avatarUrl: null,
    address: "",
  });

  const [formCreate, setFormCreate] = React.useState<UserCreateInput>({
    email: "",
    isActive: true,
    role: "Writer",
    username: "",
    password: "",
  });

  const handleCreateOnchange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormCreate((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleOnchange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  React.useEffect(() => {
    if (userSelected) {
      setForm(userSelected);
      setIsEditMode(false);
    }
  }, [userSelected]);

  const handleToggleEditMode = () => {
    if (!isEditMode) {
      setIsEditMode(true);
    } else {
      const parse = editUserSchema.safeParse(form);

      if (compareObject(form, userSelected!)) {
        setIsEditMode(false);
      } else {
        if (parse.success) {
          console.log(1);
          userEditMutation.mutate();
        } else {
          console.log(parse.error.issues);
        }
      }
    }
  };

  const userEditMutation = useMutation({
    mutationFn: async () => {
      if (
        form.avatarUrl &&
        form.avatarUrl.length > 0 &&
        isBase64DataURL(form.avatarUrl)
      ) {
        const { data } = await http.post<ImageRes>(`/images`, {
          data: form.avatarUrl,
          tags: ["avatar"],
        });
        await http.patch(`/users/${userSelected?.id}`, {
          ...form,
          avatarUrl: data.url,
        });
      } else {
        await http.patch(`/users/${userSelected?.id}`, form);
      }
    },
    onSettled() {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onSuccess() {
      toast({
        description: "🥳 Save user success",
      });
      setUserSelected(form);
      setIsEditMode(false);
    },
    onError() {
      toast({
        description: "😟 Save user fail",
      });
    },
  });

  const handleChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.includes("image")) {
      alert("Please upload an image!");
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      setForm((prev) => ({ ...prev, avatarUrl: result }));
    };
  };

  const handleDialogState = (isOpen: boolean) => {
    setFormCreate({
      email: "",
      isActive: true,
      role: "Writer",
      username: "",
      password: "",
    });
    setIsOpenCreateUser(isOpen);
    setIsHiddenPassword(true);
  };

  const createUserMutation = useMutation({
    mutationFn: async () => {
      const { data } = await http.post("/users", formCreate);
      return data;
    },
    onSettled() {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onSuccess() {
      toast({
        description: "🥳 Create user success",
      });
      handleDialogState(false);
    },
    onError() {
      toast({
        description: "😟 Create user fail",
      });
    },
  });

  const handleSubmitCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createUserMutation.mutate();
  };

  return (
    <div className="flex border rounded-md h-full overflow-hidden">
      <div className="border-r w-[220px] flex flex-col">
        <div className="flex items-center border-b p-2">
          <SearchIcon className="w-4 h-4 opacity-50" />
          <Input
            value={searchKey}
            onChange={(e) => setSearchKey(e.target.value)}
            placeholder="Search name..."
            type="text"
            className="border-none focus-visible:ring-transparent ring-inset"
          />
        </div>
        <div className=" flex flex-col gap-1 p-1 pl-2 h-full overflow-y-scroll">
          {!users ||
          users.length == 0 ||
          users.filter((u) =>
            searchKey.length === 0
              ? true
              : u.username.toLowerCase().includes(searchKey.toLowerCase())
          ).length === 0 ? (
            <p className="w-full text-center text-sm p-2">No result found</p>
          ) : (
            users
              .filter((u) =>
                searchKey.length === 0
                  ? true
                  : u.username.toLowerCase().includes(searchKey.toLowerCase())
              )
              .map((user) => (
                <div
                  key={user.id}
                  onClick={() =>
                    setUserSelected((prev) =>
                      prev?.email === user.email ? undefined : user
                    )
                  }
                  className={cn(
                    "flex items-center gap-1 p-2 rounded-md cursor-pointer",
                    userSelected?.email === user.email
                      ? "bg-accent"
                      : "hover:bg-accent"
                  )}
                >
                  <CheckIcon
                    className={cn(
                      "h-4 w-4 flex flex-shrink-0",
                      userSelected?.email === user.email
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  <div className="overflow-hidden mr-auto">
                    <p className="font-medium truncate">{user.username}</p>
                    <p className="text-xs truncate">{user.email}</p>
                  </div>
                  <LockIcon
                    className={cn(
                      "h-4 w-4 flex flex-shrink-0",
                      !user.isActive ? "opacity-100" : "opacity-0"
                    )}
                  />
                </div>
              ))
          )}
        </div>
      </div>
      <div className="flex flex-col flex-grow">
        <div className="flex items-center p-2 border-b min-h-[57px]">
          <Button
            variant="ghost"
            className={cn("h-8 w-8 p-0 mr-2", false ? "" : "hidden")}
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </Button>
          <h3 className="text-lg ">User Detail</h3>
          <div className="flex gap-1 ml-auto">
            <Button
              onClick={handleToggleEditMode}
              disabled={false}
              variant="ghost"
              className={cn(
                "rounded-full w-10 h-10 p-2",
                userSelected ? "" : "hidden"
              )}
            >
              {isEditMode ? (
                userEditMutation.isPending ? (
                  <Loader2Icon className="w-4 h-4 animate-spin" />
                ) : (
                  <SaveIcon className="w-4 h-4" />
                )
              ) : (
                <PencilIcon className="w-4 h-4" />
              )}
            </Button>

            <AlertDialog open={isOpenCreateUser}>
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
                    <AlertDialogTitle>Create new User</AlertDialogTitle>
                  </AlertDialogHeader>

                  <div className="flex flex-col space-y-4">
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        onChange={handleCreateOnchange}
                        value={formCreate.email}
                        id="email"
                        name="email"
                        type="email"
                        className={cn(
                          "focus-visible:ring-transparent",
                          users?.map((u) => u.email).includes(formCreate.email)
                            ? "border-red-500"
                            : ""
                        )}
                        placeholder="Email"
                      />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="password">Password</Label>
                      <div className="flex h-10 w-full rounded-md border border-input bg-background overflow-hidden text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                        <input
                          onChange={handleCreateOnchange}
                          value={formCreate.password}
                          type={isHiddenPassword ? "password" : "text"}
                          className="flex-grow outline-none bg-transparent placeholder:text-muted-foreground px-3 py-2"
                          id="password"
                          placeholder="Password"
                          name="password"
                        />
                        <button
                          className="flex flex-shrink-0 items-center px-2"
                          type="button"
                          tabIndex={-1}
                          onClick={() => setIsHiddenPassword((prev) => !prev)}
                        >
                          {isHiddenPassword ? (
                            <PiEyeClosedBold size={20} />
                          ) : (
                            <PiEyeBold size={20} />
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="name">Full name</Label>
                      <Input
                        onChange={handleCreateOnchange}
                        value={formCreate.username}
                        id="username"
                        name="username"
                        className="focus-visible:ring-transparent "
                        placeholder="Full name"
                      />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="name">Role</Label>
                      <Select
                        onValueChange={(v) =>
                          setFormCreate((prev) => ({
                            ...prev,
                            role: v as Role,
                          }))
                        }
                        defaultValue={formCreate.role}
                      >
                        <SelectTrigger className="focus-visible:ring-transparent">
                          <SelectValue placeholder="Select a role to display" />
                        </SelectTrigger>
                        <SelectContent>
                          {roles.map((r) => (
                            <SelectItem key={r} value={r}>
                              {r}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="name">Status</Label>
                      <Select
                        onValueChange={(v) =>
                          setFormCreate((prev) => ({
                            ...prev,
                            isActive: v === "true",
                          }))
                        }
                        defaultValue={form.isActive ? "true" : "false"}
                      >
                        <SelectTrigger className="focus-visible:ring-transparent">
                          <SelectValue placeholder="Select a active to display" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">Enable</SelectItem>
                          <SelectItem value="false">Disable</SelectItem>
                        </SelectContent>
                      </Select>
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
                        users?.map((u) => u.email).includes(formCreate.email) ||
                        formCreate.email.length === 0 ||
                        formCreate.password.length === 0 ||
                        formCreate.username.length === 0
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
        {!userSelected ? (
          <div className="p-6 text-center">No selected</div>
        ) : isEditMode ? (
          <div className="grid grid-cols-2 gap-4 p-4 overflow-y-scroll">
            <div className="col-span-2 flex flex-col items-center justify-center gap-4">
              <Avatar className="w-24 h-24">
                <AvatarImage src={form.avatarUrl ?? AvatarDefault.src} />
                <AvatarFallback className="bg-transparent">
                  <Skeleton className="w-24 h-24 rounded-full" />
                </AvatarFallback>
              </Avatar>
              <div className="flex items-center gap-4">
                <Button
                  onClick={() =>
                    setForm((prev) => ({
                      ...prev,
                      avatarUrl: userSelected.avatarUrl,
                    }))
                  }
                  disabled={form.avatarUrl === userSelected.avatarUrl}
                  type="button"
                  variant="outline"
                >
                  Reset
                </Button>

                <Label
                  className="dark:text-secondary text-white bg-primary py-[13px] px-4 rounded-md cursor-pointer"
                  htmlFor="avatar"
                >
                  Edit
                </Label>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  name="avatar"
                  id="avatar"
                  onChange={handleChangeImage}
                />
              </div>
            </div>
            <div className="col-span-2 lg:col-span-1">
              <Label className="leading-snug text-muted-foreground">Name</Label>
              <Input
                value={form.username ?? ""}
                onChange={handleOnchange}
                type="text"
                name="username"
                className="focus-visible:ring-transparent"
              />
            </div>
            <div className="col-span-2 lg:col-span-1">
              <Label className="leading-snug text-muted-foreground">
                Active
              </Label>
              <Select
                onValueChange={(v) =>
                  setForm((prev) => ({ ...prev, isActive: v === "true" }))
                }
                defaultValue={form.isActive ? "true" : "false"}
              >
                <SelectTrigger className="focus-visible:ring-transparent">
                  <SelectValue placeholder="Select a active to display" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Enable</SelectItem>
                  <SelectItem value="false">Disable</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2 lg:col-span-1">
              <Label className="leading-snug text-muted-foreground">
                Phone
              </Label>
              <Input
                value={form.phone ?? ""}
                onChange={handleOnchange}
                name="phone"
                type="text"
                className="focus-visible:ring-transparent"
              />
            </div>
            <div className="col-span-2 lg:col-span-1">
              <Label className="leading-snug text-muted-foreground">Role</Label>
              <Select
                onValueChange={(v) =>
                  setForm((prev) => ({ ...prev, role: v as Role }))
                }
                defaultValue={form.role}
              >
                <SelectTrigger className="focus-visible:ring-transparent">
                  <SelectValue placeholder="Select a role to display" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2 ">
              <Label className="leading-snug text-muted-foreground">
                Address
              </Label>
              <Input
                value={form.address ?? ""}
                onChange={handleOnchange}
                name="address"
                type="text"
                className="focus-visible:ring-transparent"
              />
            </div>
            <div className="col-span-2">
              <Label className="leading-snug text-muted-foreground">Bio</Label>
              <Textarea
                onChange={handleOnchange}
                name="bio"
                maxLength={255}
                className="focus-visible:ring-transparent"
                placeholder="Tell us a little bit about yourself"
                value={form.bio ?? ""}
              />
            </div>
          </div>
        ) : (
          <div className=" grid grid-cols-2 gap-4 p-4 overflow-y-scroll">
            <div className="flex items-center gap-4 col-span-2">
              <Avatar className="w-24 h-24">
                <AvatarImage
                  src={userSelected.avatarUrl ?? AvatarDefault.src}
                />
                <AvatarFallback className="bg-transparent">
                  <Skeleton className="w-24 h-24 rounded-full" />
                </AvatarFallback>
              </Avatar>
              <div className="w-full overflow-hidden">
                <p className="font-semibold tracking-tight text-2xl">
                  {userSelected.username}
                </p>
                <p className="text-sm text-muted-foreground">
                  {userSelected.role}
                </p>
              </div>
            </div>
            <div className="col-span-2 lg:col-span-1">
              <p className="leading-snug text-muted-foreground">Email</p>
              <p className="font-medium">{userSelected.email}</p>
            </div>
            <div className="col-span-2 lg:col-span-1">
              <p className="leading-snug text-muted-foreground">Phone</p>
              <p className="font-medium">
                {userSelected.phone.length === 0 ? "N/A" : userSelected.phone}
              </p>
            </div>
            <div className="col-span-2">
              <p className="leading-snug text-muted-foreground">Address</p>
              <p className="font-medium">
                {userSelected.address.length === 0
                  ? "N/A"
                  : userSelected.address}
              </p>
            </div>
            <div className="col-span-2">
              <p className="leading-snug text-muted-foreground">Bio</p>
              <p className="font-medium">
                {userSelected.bio.length === 0 ? "N/A" : userSelected.bio}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserPage;
