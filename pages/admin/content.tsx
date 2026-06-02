import Head from "next/head";
import type { GetStaticProps } from "next";
import {
  type FormEvent,
  type ReactNode,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Loader2,
  Lock,
  LogOut,
  Plus,
  RefreshCw,
  Save,
  Trash2,
} from "lucide-react";

type ContentFile = "site.json" | "about.json" | "blogs.json" | "gallery.json";
type ContentState = Partial<Record<ContentFile, any>>;

const FALLBACK_FILES: ContentFile[] = [
  "site.json",
  "about.json",
  "blogs.json",
  "gallery.json",
];

const FILE_LABELS: Record<ContentFile, string> = {
  "site.json": "Site",
  "about.json": "About",
  "blogs.json": "Blogs",
  "gallery.json": "Gallery",
};

const FIELD_LABEL_CLASS =
  "grid min-w-0 gap-1.5 text-sm font-semibold text-foreground";
const FIELD_INPUT_CLASS =
  "w-full min-w-0 rounded-base border-2 border-border bg-background px-3 text-sm font-normal text-foreground shadow-shadow-sm outline-none focus:ring-2 focus:ring-ring";
const FIELD_TEXTAREA_CLASS =
  "w-full min-w-0 rounded-base border-2 border-border bg-background px-3 py-2 font-mono text-sm font-normal text-foreground shadow-shadow-sm outline-none focus:ring-2 focus:ring-ring";
const TWO_COLUMN_GRID_CLASS =
  "grid min-w-0 gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]";
const COLLECTION_ROW_GRID_CLASS =
  "grid min-w-0 gap-3 rounded-base border-2 border-border p-3 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)_auto]";
const DETAILS_CARD_CLASS =
  "min-w-0 overflow-hidden rounded-base border-2 border-border p-3";
const DETAILS_GRID_CLASS =
  "mt-4 grid min-w-0 gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]";

export const getStaticProps: GetStaticProps = async (context) => ({
  props: {
    messages: (await import(`../../messages/${context.locale ?? "en"}.json`))
      .default,
  },
});

function splitLines(value: string) {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function Field({
  label,
  value,
  onChange,
  multiline = false,
  type = "text",
}: {
  label: string;
  value: any;
  onChange: (value: string) => void;
  multiline?: boolean;
  type?: string;
}) {
  return (
    <label className={FIELD_LABEL_CLASS}>
      <span className="min-w-0 break-words">{label}</span>
      {multiline ? (
        <textarea
          value={value ?? ""}
          onChange={(event) => onChange(event.target.value)}
          className={`min-h-28 ${FIELD_TEXTAREA_CLASS}`}
        />
      ) : (
        <input
          type={type}
          value={value ?? ""}
          onChange={(event) => onChange(event.target.value)}
          className={`h-10 ${FIELD_INPUT_CLASS}`}
        />
      )}
    </label>
  );
}

function CheckboxField({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="inline-flex min-w-0 items-center gap-2 text-sm font-semibold text-foreground">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="size-4 shrink-0 accent-main"
      />
      <span className="min-w-0 break-words">{label}</span>
    </label>
  );
}

function SectionHeader({
  title,
  action,
}: {
  title: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-4 flex min-w-0 items-center justify-between gap-3 border-b-2 border-border pb-3">
      <h2 className="min-w-0 break-words text-lg font-bold text-foreground">{title}</h2>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

function IconButton({
  children,
  onClick,
  type = "button",
  variant = "default",
  disabled,
}: {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  variant?: "default" | "neutral" | "danger";
  disabled?: boolean;
}) {
  const variantClass =
    variant === "danger"
      ? "bg-red-100 text-red-900 hover:bg-red-200"
      : variant === "neutral"
        ? "bg-secondary-background text-foreground hover:bg-background"
        : "bg-main text-main-foreground hover:opacity-90";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex h-10 max-w-full shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-base border-2 border-border px-3 text-sm font-bold shadow-shadow-sm transition disabled:cursor-not-allowed disabled:opacity-60 ${variantClass}`}
    >
      {children}
    </button>
  );
}

function SiteEditor({
  value,
  onChange,
}: {
  value: any;
  onChange: (value: any) => void;
}) {
  const site = value ?? {};
  const meta = site.meta ?? {};
  const header = site.header ?? {};
  const banner = site.banner ?? {};

  const updateMeta = (key: string, next: any) =>
    onChange({ ...site, meta: { ...meta, [key]: next } });
  const updateHeader = (key: string, next: any) =>
    onChange({ ...site, header: { ...header, [key]: next } });
  const updateBanner = (key: string, next: any) =>
    onChange({ ...site, banner: { ...banner, [key]: next } });

  return (
    <div className="space-y-6">
      <section>
        <SectionHeader title="Header" />
        <div className={TWO_COLUMN_GRID_CLASS}>
          <Field
            label="Logo URL"
            value={header.logoUrl}
            onChange={(next) => updateHeader("logoUrl", next)}
          />
          <Field
            label="Navigation hrefs"
            value={(header.navMap ?? []).map((item) => item.href).join("\n")}
            multiline
            onChange={(next) =>
              updateHeader(
                "navMap",
                splitLines(next).map((href) => ({ href })),
              )
            }
          />
        </div>
      </section>

      <section>
        <SectionHeader title="Meta" />
        <div className={TWO_COLUMN_GRID_CLASS}>
          <Field label="Name" value={meta.name} onChange={(next) => updateMeta("name", next)} />
          <Field label="URL" value={meta.url} onChange={(next) => updateMeta("url", next)} />
          <Field label="Image" value={meta.image} onChange={(next) => updateMeta("image", next)} />
          <Field
            label="Theme color"
            value={meta.themeColor}
            onChange={(next) => updateMeta("themeColor", next)}
          />
          <Field
            label="Keywords"
            value={(meta.keywords ?? []).join("\n")}
            multiline
            onChange={(next) => updateMeta("keywords", splitLines(next))}
          />
        </div>
      </section>

      <section>
        <SectionHeader title="Banner" />
        <div className={TWO_COLUMN_GRID_CLASS}>
          <Field
            label="CTA URL"
            value={banner.ctaUrl}
            onChange={(next) => updateBanner("ctaUrl", next)}
          />
          <div className="flex items-end">
            <CheckboxField
              label="Downloadable"
              checked={Boolean(banner.downloadable)}
              onChange={(next) => updateBanner("downloadable", next)}
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function AboutEditor({
  value,
  onChange,
}: {
  value: any;
  onChange: (value: any) => void;
}) {
  const about = value ?? {};

  const setField = (key: string, next: any) => onChange({ ...about, [key]: next });
  const updateArrayItem = (
    field: string,
    index: number,
    key: string,
    next: any,
  ) => {
    const items = [...(about[field] ?? [])];
    items[index] = { ...items[index], [key]: next };
    setField(field, items);
  };
  const addArrayItem = (field: string, item: any) =>
    setField(field, [...(about[field] ?? []), item]);
  const removeArrayItem = (field: string, index: number) =>
    setField(
      field,
      (about[field] ?? []).filter((_, itemIndex) => itemIndex !== index),
    );

  return (
    <div className="space-y-6">
      <section>
        <SectionHeader title="Profile" />
        <div className={TWO_COLUMN_GRID_CLASS}>
          <Field label="Name" value={about.name} onChange={(next) => setField("name", next)} />
          <Field label="Image URL" value={about.imageUrl} onChange={(next) => setField("imageUrl", next)} />
          <Field label="Location" value={about.location} onChange={(next) => setField("location", next)} />
          <Field label="Designation" value={about.designation} onChange={(next) => setField("designation", next)} />
          <Field label="Education" value={about.education} onChange={(next) => setField("education", next)} />
          <Field label="Bio HTML" value={about.bio} multiline onChange={(next) => setField("bio", next)} />
        </div>
      </section>

      <section>
        <SectionHeader
          title="Social Links"
          action={
            <IconButton onClick={() => addArrayItem("profiles", { name: "", url: "" })} variant="neutral">
              <Plus className="size-4" />
              Add
            </IconButton>
          }
        />
        <div className="space-y-3">
          {(about.profiles ?? []).map((profile, index) => (
            <div key={index} className={COLLECTION_ROW_GRID_CLASS}>
              <Field label="Name" value={profile.name} onChange={(next) => updateArrayItem("profiles", index, "name", next)} />
              <Field label="URL" value={profile.url} onChange={(next) => updateArrayItem("profiles", index, "url", next)} />
              <div className="flex items-end">
                <IconButton onClick={() => removeArrayItem("profiles", index)} variant="danger">
                  <Trash2 className="size-4" />
                  Remove
                </IconButton>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <SectionHeader
          title="Experience"
          action={
            <IconButton
              onClick={() =>
                addArrayItem("experience", {
                  company: "",
                  logo: "",
                  from: "",
                  to: "",
                  technologies: [],
                  designation: "",
                  location: "",
                })
              }
              variant="neutral"
            >
              <Plus className="size-4" />
              Add
            </IconButton>
          }
        />
        <div className="space-y-4">
          {(about.experience ?? []).map((item, index) => (
            <details key={index} open={index === 0} className={DETAILS_CARD_CLASS}>
              <summary className="cursor-pointer text-sm font-bold text-foreground">
                {item.company || item.designation || `Experience ${index + 1}`}
              </summary>
              <div className={DETAILS_GRID_CLASS}>
                <Field label="Company" value={item.company} onChange={(next) => updateArrayItem("experience", index, "company", next)} />
                <Field label="Logo URL" value={item.logo} onChange={(next) => updateArrayItem("experience", index, "logo", next)} />
                <Field label="From" value={item.from} onChange={(next) => updateArrayItem("experience", index, "from", next)} />
                <Field label="To" value={item.to} onChange={(next) => updateArrayItem("experience", index, "to", next)} />
                <Field label="Designation" value={item.designation} onChange={(next) => updateArrayItem("experience", index, "designation", next)} />
                <Field label="Location" value={item.location} onChange={(next) => updateArrayItem("experience", index, "location", next)} />
                <Field
                  label="Technologies"
                  value={(item.technologies ?? []).join("\n")}
                  multiline
                  onChange={(next) => updateArrayItem("experience", index, "technologies", splitLines(next))}
                />
                <div className="flex items-end justify-end">
                  <IconButton onClick={() => removeArrayItem("experience", index)} variant="danger">
                    <Trash2 className="size-4" />
                    Remove
                  </IconButton>
                </div>
              </div>
            </details>
          ))}
        </div>
      </section>

      <section>
        <SectionHeader
          title="Skills"
          action={
            <IconButton onClick={() => addArrayItem("skills", { name: "", logo: "" })} variant="neutral">
              <Plus className="size-4" />
              Add
            </IconButton>
          }
        />
        <div className="space-y-3">
          {(about.skills ?? []).map((skill, index) => (
            <div key={index} className={COLLECTION_ROW_GRID_CLASS}>
              <Field label="Name" value={skill.name} onChange={(next) => updateArrayItem("skills", index, "name", next)} />
              <Field label="Logo URL" value={skill.logo} onChange={(next) => updateArrayItem("skills", index, "logo", next)} />
              <div className="flex items-end">
                <IconButton onClick={() => removeArrayItem("skills", index)} variant="danger">
                  <Trash2 className="size-4" />
                  Remove
                </IconButton>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <SectionHeader title="Map" />
        <Field
          label="Countries visited"
          value={(about.countriesVisited ?? []).join("\n")}
          multiline
          onChange={(next) => setField("countriesVisited", splitLines(next))}
        />
      </section>
    </div>
  );
}

function BlogsEditor({
  value,
  onChange,
}: {
  value: any[];
  onChange: (value: any[]) => void;
}) {
  const blogs = Array.isArray(value) ? value : [];
  const updateBlog = (index: number, key: string, next: any) => {
    const items = [...blogs];
    items[index] = { ...items[index], [key]: next };
    onChange(items);
  };

  return (
    <div className="space-y-4">
      <SectionHeader
        title="Posts"
        action={
          <IconButton
            onClick={() =>
              onChange([
                {
                  title: "",
                  shortDescription: "",
                  banner: "",
                  thumbnail: "",
                  author: "",
                  profileLink: "",
                  hidden: false,
                  content: "",
                  date: new Date().toISOString(),
                  type: "blogs",
                  link: "",
                  tags: "",
                },
                ...blogs,
              ])
            }
            variant="neutral"
          >
            <Plus className="size-4" />
            Add
          </IconButton>
        }
      />
      {blogs.map((blog, index) => (
        <details key={index} open={index === 0} className={DETAILS_CARD_CLASS}>
          <summary className="cursor-pointer text-sm font-bold text-foreground">
            {blog.title || `Post ${index + 1}`}
          </summary>
          <div className={DETAILS_GRID_CLASS}>
            <Field label="Title" value={blog.title} onChange={(next) => updateBlog(index, "title", next)} />
            <Field label="Slug or URL" value={blog.link} onChange={(next) => updateBlog(index, "link", next)} />
            <Field label="Type" value={blog.type} onChange={(next) => updateBlog(index, "type", next)} />
            <Field label="Date" value={blog.date} onChange={(next) => updateBlog(index, "date", next)} />
            <Field label="Thumbnail URL" value={blog.thumbnail} onChange={(next) => updateBlog(index, "thumbnail", next)} />
            <Field label="Banner URL" value={blog.banner} onChange={(next) => updateBlog(index, "banner", next)} />
            <Field label="Author" value={blog.author} onChange={(next) => updateBlog(index, "author", next)} />
            <Field label="Profile URL" value={blog.profileLink} onChange={(next) => updateBlog(index, "profileLink", next)} />
            <Field label="Tags" value={blog.tags} onChange={(next) => updateBlog(index, "tags", next)} />
            <Field label="Short description" value={blog.shortDescription} multiline onChange={(next) => updateBlog(index, "shortDescription", next)} />
            <Field label="Content URL or Markdown" value={blog.content} multiline onChange={(next) => updateBlog(index, "content", next)} />
            <div className="flex items-end justify-between gap-3">
              <CheckboxField label="Hidden" checked={Boolean(blog.hidden)} onChange={(next) => updateBlog(index, "hidden", next)} />
              <IconButton onClick={() => onChange(blogs.filter((_, itemIndex) => itemIndex !== index))} variant="danger">
                <Trash2 className="size-4" />
                Remove
              </IconButton>
            </div>
          </div>
        </details>
      ))}
    </div>
  );
}

function GalleryEditor({
  value,
  onChange,
}: {
  value: any[];
  onChange: (value: any[]) => void;
}) {
  const items = Array.isArray(value) ? value : [];
  const updateItem = (index: number, key: string, next: any) => {
    const nextItems = [...items];
    nextItems[index] = { ...nextItems[index], [key]: next };
    onChange(nextItems);
  };

  return (
    <div className="space-y-4">
      <SectionHeader
        title="Photos"
        action={
          <IconButton
            onClick={() =>
              onChange([
                {
                  id: "",
                  src: "",
                  thumb: "",
                  caption: "",
                  category: "",
                  location: "",
                },
                ...items,
              ])
            }
            variant="neutral"
          >
            <Plus className="size-4" />
            Add
          </IconButton>
        }
      />
      {items.map((item, index) => (
        <details key={index} open={index === 0} className={DETAILS_CARD_CLASS}>
          <summary className="cursor-pointer text-sm font-bold text-foreground">
            {item.caption || item.id || `Photo ${index + 1}`}
          </summary>
          <div className={DETAILS_GRID_CLASS}>
            <Field label="ID" value={item.id} onChange={(next) => updateItem(index, "id", next)} />
            <Field label="Category" value={item.category} onChange={(next) => updateItem(index, "category", next)} />
            <Field label="Location" value={item.location} onChange={(next) => updateItem(index, "location", next)} />
            <Field label="Caption" value={item.caption} onChange={(next) => updateItem(index, "caption", next)} />
            <Field label="Image URL" value={item.src} onChange={(next) => updateItem(index, "src", next)} />
            <Field label="Thumb URL" value={item.thumb} onChange={(next) => updateItem(index, "thumb", next)} />
            <div className="flex items-end justify-end md:col-span-2">
              <IconButton onClick={() => onChange(items.filter((_, itemIndex) => itemIndex !== index))} variant="danger">
                <Trash2 className="size-4" />
                Remove
              </IconButton>
            </div>
          </div>
        </details>
      ))}
    </div>
  );
}

function RawPreview({ value }: { value: any }) {
  return (
    <details className="rounded-base border-2 border-border bg-secondary-background p-3">
      <summary className="cursor-pointer text-sm font-bold text-foreground">Raw JSON</summary>
      <pre className="mt-3 max-h-96 overflow-auto rounded-base border-2 border-border bg-background p-3 text-xs text-foreground">
        {JSON.stringify(value, null, 2)}
      </pre>
    </details>
  );
}

export default function ContentAdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [files, setFiles] = useState<ContentFile[]>(FALLBACK_FILES);
  const [selectedFile, setSelectedFile] = useState<ContentFile>("about.json");
  const [content, setContent] = useState<ContentState>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");

  const selectedContent = useMemo(
    () => content[selectedFile],
    [content, selectedFile],
  );

  const updateSelectedContent = (next: any) => {
    setContent((previous) => ({
      ...previous,
      [selectedFile]: next,
    }));
  };

  const loadContent = async () => {
    setLoading(true);
    setStatus("");
    try {
      const response = await fetch("/api/admin/content");
      if (response.status === 401) {
        setAuthenticated(false);
        return;
      }
      if (!response.ok) {
        throw new Error("Unable to load content");
      }
      const payload = await response.json();
      setFiles(payload.files ?? FALLBACK_FILES);
      setContent(payload.content ?? {});
      setAuthenticated(true);
    } catch (err: any) {
      setStatus(err?.message || "Unable to load content");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContent();
  }, []);

  const login = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setStatus("");
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!response.ok) {
        throw new Error("Invalid password");
      }
      setPassword("");
      await loadContent();
    } catch (err: any) {
      setStatus(err?.message || "Unable to sign in");
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuthenticated(false);
    setContent({});
  };

  const saveSelectedFile = async () => {
    setSaving(true);
    setStatus("");
    try {
      const response = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: selectedFile,
          data: selectedContent,
        }),
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || "Unable to save content");
      }
      setStatus(`${FILE_LABELS[selectedFile]} saved`);
    } catch (err: any) {
      setStatus(err?.message || "Unable to save content");
    } finally {
      setSaving(false);
    }
  };

  const renderEditor = () => {
    switch (selectedFile) {
      case "site.json":
        return <SiteEditor value={selectedContent} onChange={updateSelectedContent} />;
      case "about.json":
        return <AboutEditor value={selectedContent} onChange={updateSelectedContent} />;
      case "blogs.json":
        return <BlogsEditor value={selectedContent} onChange={updateSelectedContent} />;
      case "gallery.json":
        return <GalleryEditor value={selectedContent} onChange={updateSelectedContent} />;
      default:
        return null;
    }
  };

  return (
    <>
      <Head>
        <title>Content Admin | Prasheel Soni</title>
      </Head>
      <div className="min-h-screen bg-background">
        <main className="mx-auto grid w-full max-w-7xl min-w-0 gap-6 overflow-x-clip px-4 py-6 md:px-6 lg:grid-cols-[240px_minmax(0,1fr)]">
          <aside className="rounded-base border-2 border-border bg-secondary-background p-4 shadow-shadow-sm lg:sticky lg:top-6 lg:h-[calc(100vh-48px)]">
            <div className="mb-5 flex items-center gap-2">
              <div className="flex size-9 items-center justify-center rounded-base border-2 border-border bg-main text-main-foreground shadow-shadow-sm">
                <Lock className="size-4" />
              </div>
              <div>
                <h1 className="text-lg font-black text-foreground">Content Admin</h1>
                <p className="text-xs font-semibold text-muted-foreground">Cloudinary JSON</p>
              </div>
            </div>

            {authenticated && (
              <>
                <nav className="grid gap-2">
                  {files.map((file) => (
                    <button
                      key={file}
                      type="button"
                      onClick={() => setSelectedFile(file)}
                      className={`rounded-base border-2 border-border px-3 py-2 text-left text-sm font-bold shadow-shadow-sm transition ${
                        selectedFile === file
                          ? "bg-main text-main-foreground"
                          : "bg-background text-foreground hover:bg-secondary-background"
                      }`}
                    >
                      {FILE_LABELS[file]}
                    </button>
                  ))}
                </nav>

                <div className="mt-5 grid gap-2">
                  <IconButton onClick={loadContent} variant="neutral" disabled={loading}>
                    <RefreshCw className="size-4" />
                    Refresh
                  </IconButton>
                  <IconButton onClick={logout} variant="neutral">
                    <LogOut className="size-4" />
                    Sign out
                  </IconButton>
                </div>
              </>
            )}
          </aside>

          <section className="min-w-0 overflow-hidden rounded-base border-2 border-border bg-background p-4 shadow-shadow md:p-6">
            {!authenticated ? (
              <form onSubmit={login} className="mx-auto grid max-w-md gap-4 py-16">
                <div>
                  <h2 className="text-2xl font-black text-foreground">Sign in</h2>
                  <p className="mt-1 text-sm text-muted-foreground">Sign in to edit portfolio content.</p>
                </div>
                <label htmlFor="admin-password" className="grid gap-1.5 text-sm font-bold text-foreground">
                  Password
                  <input
                    id="admin-password"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="h-11 rounded-base border-2 border-border bg-background px-3 text-foreground shadow-shadow-sm outline-none focus:ring-2 focus:ring-ring"
                  />
                </label>
                <IconButton type="submit" disabled={loading}>
                  {loading ? <Loader2 className="size-4 animate-spin" /> : <Lock className="size-4" />}
                  Sign in
                </IconButton>
                {status && <p className="text-sm font-semibold text-red-700">{status}</p>}
              </form>
            ) : (
              <div className="grid min-w-0 gap-6">
                <div className="flex flex-col gap-3 border-b-2 border-border pb-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-2xl font-black text-foreground">{FILE_LABELS[selectedFile]}</h2>
                    <p className="text-sm text-muted-foreground">{selectedFile}</p>
                  </div>
                  <IconButton onClick={saveSelectedFile} disabled={saving || loading}>
                    {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
                    Save
                  </IconButton>
                </div>

                {loading ? (
                  <div className="flex min-h-80 items-center justify-center text-muted-foreground">
                    <Loader2 className="mr-2 size-5 animate-spin" />
                    Loading
                  </div>
                ) : (
                  <>
                    {renderEditor()}
                    <RawPreview value={selectedContent} />
                  </>
                )}

                {status && (
                  <div className="rounded-base border-2 border-border bg-secondary-background px-3 py-2 text-sm font-bold text-foreground">
                    {status}
                  </div>
                )}
              </div>
            )}
          </section>
        </main>
      </div>
    </>
  );
}
