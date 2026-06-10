interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProjectDetailsPage({
  params,
}: PageProps) {
  const { slug } = await params;

  return (
    <div className="p-10">
      <h1 className="text-4xl font-bold">
        {slug}
      </h1>

      <p className="mt-4 text-gray-500">
        Project Details Page Coming Soon
      </p>
    </div>
  );
}