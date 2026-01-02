import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ZUSATZKURSE_CATEGORIES } from "~/constants/exam-registration";

export function useCourseSelection() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(["it"])
  );
  const [selectedCourses, setSelectedCourses] = useState<Set<string>>(
    new Set()
  );

  // Filter courses based on search
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return ZUSATZKURSE_CATEGORIES;

    const query = searchQuery.toLowerCase();
    return ZUSATZKURSE_CATEGORIES.map((cat) => ({
      ...cat,
      courses: cat.courses.filter((course) =>
        course.name.toLowerCase().includes(query)
      ),
    })).filter((cat) => cat.courses.length > 0);
  }, [searchQuery]);

  const toggleCategory = (catId: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(catId)) {
        next.delete(catId);
      } else {
        next.add(catId);
      }
      return next;
    });
  };

  const toggleCourse = (courseId: string) => {
    setSelectedCourses((prev) => {
      if (prev.has(courseId)) {
        return new Set();
      } else {
        return new Set([courseId]);
      }
    });
  };

  const selectedCourseDetails = useMemo(() => {
    const details: {
      id: string;
      name: string;
      credits: number;
      type: string;
      status?: string;
      grade?: string;
    }[] = [];
    ZUSATZKURSE_CATEGORIES.forEach((cat) => {
      cat.courses.forEach((course) => {
        if (selectedCourses.has(course.id)) {
          details.push(course);
        }
      });
    });
    return details;
  }, [selectedCourses]);

  const handleGoToAbgaben = () => {
    const coursesData = selectedCourseDetails.map((c) => ({
      id: c.id,
      name: c.name,
      credits: c.credits,
    }));
    localStorage.setItem(
      "selectedWeiterbildungskurse",
      JSON.stringify(coursesData)
    );
    navigate("/antragsverwaltung");
  };

  return {
    searchQuery,
    setSearchQuery,
    expandedCategories,
    selectedCourses,
    filteredCategories,
    toggleCategory,
    toggleCourse,
    selectedCourseDetails,
    handleGoToAbgaben,
  };
}
