import { getCompanies } from "@/api/apiCompanies";
import { addNewJob } from "@/api/apiJobs";
import AddCompanyDrawer from "@/components/add-company-drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import useFetch from "@/hooks/use-fetch";
import { useUser } from "@clerk/clerk-react";
import { zodResolver } from "@hookform/resolvers/zod";
import MDEditor from "@uiw/react-md-editor";
import { State } from "country-state-city";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Navigate, useNavigate } from "react-router-dom";
import { BarLoader } from "react-spinners";
import { z } from "zod";


const schema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  location: z.string().min(1, { message: "Select a location" }),
  company_id: z.string().min(1, { message: "Select or Add a new Company" }),
  requirements: z.string().min(1, { message: "Requirements are required" }),
});

const PostJob = () => {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: { location: "", company_id: "", requirements: "" },
    resolver: zodResolver(schema),
  });

  const {
    loading: loadingCreateJob,
    error: errorCreateJob,
    data: dataCreateJob,
    fn: fnCreateJob,
  } = useFetch(addNewJob);


  const onSubmit = (data) => {
    fnCreateJob(
      {}, 
      {
        ...data,
        company_id: Number(data.company_id), 
        recruiter_id: user.id, 
        isOpen: true,
      }
    );
  };

  useEffect(() => {
    if (dataCreateJob?.length > 0) {
      navigate("/my-jobs");
    }
  }, [dataCreateJob, navigate]);

  if (!isLoaded) return <BarLoader className="mt-4" width={"100%"} color="#36d7b7" />;

  if (!user) return <Navigate to="/sign-in" />;

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-md">
      <h1 className="text-2xl font-bold mb-6">Post a Job</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block font-medium">Job Title</label>
          <Input placeholder="e.g. Frontend Developer" {...register("title")} />
          {errors.title && <p className="text-red-500">{errors.title.message}</p>}
        </div>

        {/* Description */}
        <div>
          <label className="block font-medium">Job Description</label>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <MDEditor value={field.value} onChange={field.onChange} height={200} />
            )}
          />
          {errors.description && (
            <p className="text-red-500">{errors.description.message}</p>
          )}
        </div>

        {/* Requirements */}
        <div>
          <label className="block font-medium">Requirements</label>
          <Textarea placeholder="List required skills..." {...register("requirements")} />
          {errors.requirements && (
            <p className="text-red-500">{errors.requirements.message}</p>
          )}
        </div>

        {/* Location */}
        <div>
          <label className="block font-medium">Location</label>
          <Controller
            name="location"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {State.getStatesOfCountry("IN").map((state) => (
                      <SelectItem key={state.isoCode} value={state.name}>
                        {state.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
          {errors.location && (
            <p className="text-red-500">{errors.location.message}</p>
          )}
        </div>

        {/* Company */}
        <div>
          <label className="block font-medium">Company</label>
          <Controller
            name="company_id"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select company" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <AddCompanyDrawer />
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
          {errors.company_id && (
            <p className="text-red-500">{errors.company_id.message}</p>
          )}
        </div>

        {/* Submit */}
        <Button type="submit" className="w-full" disabled={loadingCreateJob}>
          {loadingCreateJob ? "Posting..." : "Post Job"}
        </Button>

        {errorCreateJob && (
          <p className="text-red-500 mt-2">Error: {errorCreateJob.message}</p>
        )}
      </form>
    </div>
  );
};

export default PostJob;
