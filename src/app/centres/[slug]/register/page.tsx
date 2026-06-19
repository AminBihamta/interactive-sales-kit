import { notFound } from "next/navigation";
import { getCentreBySlug } from "@/lib/centres";
import { CentreHeader } from "@/components/journey/CentreHeader";
import { EnquiryForm } from "@/components/register/EnquiryForm";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function RegisterPage({ params }: PageProps) {
  const { slug } = await params;
  const centre = getCentreBySlug(slug);

  if (!centre) {
    notFound();
  }

  return (
    <div>
      <CentreHeader centre={centre} />
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold">Confirm your interest</h2>
        <p className="mt-2 text-muted-foreground">
          We are looking forward to many Best Beginnings with your child!
        </p>
      </div>
      <EnquiryForm centre={centre} />
    </div>
  );
}
