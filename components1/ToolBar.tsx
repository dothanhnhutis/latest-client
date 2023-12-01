"use client";
import Image from "next/image";
import React, { ChangeEvent, useState } from "react";
import {
  AlignCenterIcon,
  AlignJustifyIcon,
  AlignLeftIcon,
  AlignRightIcon,
  BoldIcon,
  Check,
  ChevronsUpDown,
  Eraser,
  ImagePlusIcon,
  ItalicIcon,
  LinkIcon,
  ListIcon,
  ListOrdered,
  PaletteIcon,
  Pilcrow,
  RemoveFormattingIcon,
  UnderlineIcon,
} from "lucide-react";
import { Editor } from "@tiptap/react";
import { Button } from "./ui/button";
import {
  cn,
  convertHexToRGBA,
  convertNumToHex,
  convertRGBAToHex,
} from "@/lib/utils";
import { Skeleton } from "./ui/skeleton";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Command, CommandGroup, CommandItem } from "./ui/command";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

import { RGBColor, SketchPicker } from "react-color";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

type Action = {
  value: string;
  label: string;
  icon?: React.JSX.Element;
  Run: (editor: Editor) => void;
  isActive: (editor: Editor) => boolean;
};

type DropdownAction = Action & {
  id: number;
};

type ButtonAction = Action & {
  id?: number;
  disabled?: (editor: Editor) => boolean;
};

const dropdownActions: DropdownAction[] = [
  {
    id: 1,
    value: "paragraph",
    label: "Paragraph",
    icon: <Pilcrow className="h-5 w-5" />,
    Run: (editor: Editor) => {
      editor.chain().focus().setParagraph().run();
    },
    isActive: (editor: Editor): boolean => {
      return editor.isActive("paragraph");
    },
  },
  {
    id: 2,
    value: "heading-1",
    label: "Heading 1",
    Run: (editor: Editor) => {
      editor.chain().focus().toggleHeading({ level: 1 }).run();
    },
    isActive: (editor: Editor): boolean => {
      return editor.isActive("heading", { level: 1 });
    },
  },
  {
    id: 3,
    value: "heading-2",
    label: "Heading 2",
    Run: (editor: Editor) => {
      editor.chain().focus().toggleHeading({ level: 2 }).run();
    },
    isActive: (editor: Editor): boolean => {
      return editor.isActive("heading", { level: 2 });
    },
  },
  {
    id: 4,
    value: "heading-3",
    label: "Heading 3",
    Run: (editor: Editor) => {
      editor.chain().focus().toggleHeading({ level: 3 }).run();
    },
    isActive: (editor: Editor): boolean => {
      return editor.isActive("heading", { level: 3 });
    },
  },
  {
    id: 5,
    value: "heading-4",
    label: "Heading 4",
    Run: (editor: Editor) => {
      editor.chain().focus().toggleHeading({ level: 4 }).run();
    },
    isActive: (editor: Editor): boolean => {
      return editor.isActive("heading", { level: 4 });
    },
  },
];

const buttonActions: ButtonAction[] = [
  {
    id: 1,
    value: "bold",
    label: "Bold",
    icon: <BoldIcon className="h-5 w-5" />,
    isActive: (editor: Editor) => editor.isActive("bold"),
    Run: (editor: Editor) => {
      editor.chain().focus().toggleBold().run();
    },
  },
  {
    id: 2,
    value: "italic",
    label: "Italic",
    icon: <ItalicIcon className="h-5 w-5" />,
    isActive: (editor: Editor) => editor.isActive("italic"),
    Run: (editor: Editor) => {
      editor.chain().focus().toggleItalic().run();
    },
  },
  {
    id: 3,
    value: "underline",
    label: "Underline",
    icon: <UnderlineIcon className="h-5 w-5" />,
    isActive: (editor: Editor) => editor.isActive("underline"),
    Run: (editor: Editor) => {
      editor.chain().focus().toggleUnderline().run();
    },
  },
  {
    id: 4,
    value: "left",
    label: "Left",
    icon: <AlignLeftIcon className="h-5 w-5" />,
    isActive: (editor: Editor) => editor.isActive({ textAlign: "left" }),
    Run: (editor: Editor) => {
      editor.chain().focus().setTextAlign("left").run();
    },
  },
  {
    id: 5,
    value: "center",
    label: "Center",
    icon: <AlignCenterIcon className="h-5 w-5" />,
    isActive: (editor: Editor) => editor.isActive({ textAlign: "center" }),
    Run: (editor: Editor) => {
      editor.chain().focus().setTextAlign("center").run();
    },
  },
  {
    id: 6,
    value: "right",
    label: "Right",
    icon: <AlignRightIcon className="h-5 w-5" />,
    isActive: (editor: Editor) => editor.isActive({ textAlign: "right" }),
    Run: (editor: Editor) => {
      editor.chain().focus().setTextAlign("right").run();
    },
  },
  {
    id: 7,
    value: "justify",
    label: "Justify",
    icon: <AlignJustifyIcon className="h-5 w-5" />,
    isActive: (editor: Editor) => editor.isActive({ textAlign: "justify" }),
    Run: (editor: Editor) => {
      editor.chain().focus().setTextAlign("justify").run();
    },
  },
  {
    id: 8,
    value: "bulletList",
    label: "BulletList",
    icon: <ListIcon className="h-5 w-5" />,
    isActive: (editor: Editor) => editor.isActive("bulletList"),
    Run: (editor: Editor) => {
      editor.chain().focus().toggleBulletList().run();
    },
  },
  {
    id: 9,
    value: "orderedList",
    label: "OrderedList",
    icon: <ListOrdered className="h-5 w-5" />,
    isActive: (editor: Editor) => editor.isActive("orderedList"),
    Run: (editor: Editor) => {
      editor.chain().focus().toggleOrderedList().run();
    },
  },
];

const DropdownActions = ({
  editor,
  actions,
}: {
  editor: Editor | null;
  actions: DropdownAction[];
}) => {
  if (editor) {
    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState<string>("paragraph");
    editor.on("selectionUpdate", ({ editor, transaction }) => {
      const currentblock = actions
        .filter((a) => a.isActive(editor as Editor))
        .map((a) => a.value)[0];
      setValue(currentblock);
    });
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[150px] justify-between"
          >
            {actions.find((ac) => ac.value === value)?.label ?? "Paragraph"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[150px] p-0">
          <Command>
            <CommandGroup>
              {actions.map((ac) => (
                <CommandItem
                  key={ac.id}
                  value={ac.value}
                  onSelect={(currentValue) => {
                    setValue(
                      currentValue === value ? "paragraph" : currentValue
                    );
                    ac.Run(editor);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === ac.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {ac.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    );
  } else {
    return <Skeleton className="rounded-md w-[150px] h-10" />;
  }
};

const ButtonAction = ({
  editor,
  action,
}: {
  editor: Editor | null;
  action: ButtonAction;
}) => {
  return editor ? (
    <Button
      type="button"
      size="icon"
      onClick={() => action.Run(editor)}
      variant={action.isActive(editor) ? "secondary" : "ghost"}
      className={cn("p-2 rounded-full")}
      disabled={action.disabled && action.disabled(editor)}
    >
      {action.icon ?? action.label}
    </Button>
  ) : (
    <Skeleton className="rounded-full w-10 h-10" />
  );
};

const LinkAction = ({ editor }: { editor: Editor | null }) => {
  if (!editor) return <Skeleton className="rounded-full w-10 h-10" />;
  const [show, setshow] = useState<boolean>(false);
  const [url, setUrl] = useState<string>("");
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (url.length) {
      editor.commands.setLink({
        href: url,
        target: "_blank",
      });
      setUrl("");
    } else {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    }
    setshow(false);
  };

  const handleOpen = () => {
    if (editor.isActive("link")) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    } else {
      setshow(true);
    }
  };

  return (
    <Popover open={show}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          size="icon"
          variant={editor.isActive("link") ? "secondary" : "ghost"}
          onClick={handleOpen}
          className={cn("p-2 rounded-full")}
        >
          <LinkIcon className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        onPointerDownOutside={() => {
          setshow(false);
          setUrl("");
        }}
        asChild
        className="p-0"
      >
        <form onSubmit={handleSubmit} className="p-1">
          <Label htmlFor="link">Link</Label>
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="focus-visible:ring-transparent mb-1"
            type="link"
            id="link"
          />
          <Button
            className=""
            type="submit"
            onClick={() => {
              setshow(false);
            }}
          >
            save
          </Button>
        </form>
      </PopoverContent>
    </Popover>
  );
};

const ImageAction = ({ editor }: { editor: Editor | null }) => {
  if (!editor) return <Skeleton className="rounded-full w-10 h-10" />;
  const [data, setData] = useState<{ caption: string; url: string }>({
    caption: "",
    url: "",
  });

  const handleSubmit = () => {
    editor
      .chain()
      .focus()
      .setImage({
        src: data.url,
        alt: data.caption,
        title: data.caption,
      })
      .run();
    setData({
      caption: "",
      url: "",
    });
  };

  const onchangeImage = (e: ChangeEvent<HTMLInputElement>) => {
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
      setData((prev) => ({ ...prev, url: result }));
    };
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          type="button"
          size="icon"
          variant="ghost"
          // onClick={addImage}
          className={cn("p-2 rounded-full")}
        >
          <ImagePlusIcon className="h-5 w-5" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Image</AlertDialogTitle>
          <AlertDialogDescription>
            Upload new image or select on library
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Tabs defaultValue="upload">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">Upload</TabsTrigger>
            <TabsTrigger value="library">Library</TabsTrigger>
          </TabsList>
          <TabsContent value="upload" className="flex flex-col">
            <Label
              htmlFor="tiptip-image-upload"
              className="border-2 border-dashed w-full h-[200px] rounded-lg flex items-center justify-center cursor-pointer"
            >
              {data.url ? (
                <Image
                  priority
                  src={data.url}
                  width={200}
                  height={200}
                  alt="tiptip-image-upload"
                />
              ) : (
                <ImagePlusIcon className="w-14 h-14" />
              )}

              <input
                onChange={onchangeImage}
                type="file"
                name="tiptip-image-upload"
                id="tiptip-image-upload"
                className="hidden"
              />
            </Label>
          </TabsContent>
          <TabsContent value="library">mainhen</TabsContent>
          <Input
            value={data.caption}
            onChange={(e) => {
              setData((prev) => ({ ...prev, caption: e.target.value }));
            }}
            placeholder="Caption"
            className="mt-2 focus-visible:ring-transparent"
          />
        </Tabs>

        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => {
              setData({
                caption: "",
                url: "",
              });
            }}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleSubmit}>Add</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

const ColorAction = ({ editor }: { editor: Editor | null }) => {
  const [colorPicker, setColorPicker] = useState<RGBColor>({
    r: 0,
    g: 0,
    b: 0,
    a: 1,
  });
  return editor ? (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className="p-2 rounded-full"
          variant={
            editor.getAttributes("textStyle").color ? "secondary" : "ghost"
          }
          type="button"
          size="icon"
        >
          <PaletteIcon className="rounded-full w-5 h-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-0 border-none">
        <SketchPicker
          presetColors={[
            "#2456b8",
            "#ff0000",
            "#F5A623",
            "#F8E71C",
            "#8B572A",
            "#7ED321",
            "#417505",
            "#BD10E0",
            "#9013FE",
            "#4A90E2",
            "#50E3C2",
            "#B8E986",
            "#000000",
            "#4A4A4A",
            "#9B9B9B",
            "#FFFFFF",
          ]}
          color={
            editor.getAttributes("textStyle").color
              ? convertHexToRGBA(editor.getAttributes("textStyle").color)
              : colorPicker
          }
          onChange={(e) => {
            setColorPicker(e.rgb);
            editor.chain().focus().setColor(convertRGBAToHex(e.rgb)).run();
          }}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  ) : (
    <Skeleton className="rounded-full w-10 h-10" />
  );
};

const ToolBar = ({ editor }: { editor: Editor | null }) => {
  return (
    <div className="flex flex-wrap gap-2 mb-2">
      <DropdownActions editor={editor} actions={dropdownActions} />
      {buttonActions.map((buttonAction) => (
        <ButtonAction
          key={buttonAction.id}
          editor={editor}
          action={buttonAction}
        />
      ))}
      <LinkAction editor={editor} />
      <ImageAction editor={editor} />
      <ColorAction editor={editor} />
      <ButtonAction
        editor={editor}
        action={{
          icon: <Eraser className="h-5 w-5" />,
          Run: () => editor?.commands.clearContent(),
          value: "clear",
          label: "Clear",
          isActive: () => false,
          disabled: (editor) => editor.getText().length === 0,
        }}
      />
      <ButtonAction
        editor={editor}
        action={{
          icon: <RemoveFormattingIcon className="h-5 w-5" />,
          Run: () => {
            editor?.commands.unsetAllMarks();
            editor?.commands.clearNodes();
          },
          value: "remove-format",
          label: "Remove Format",
          isActive: () => false,
        }}
      />
    </div>
  );
};

export default ToolBar;
