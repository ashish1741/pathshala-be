import mongoose, { Document, Model, Schema } from "mongoose";

interface IComment extends Document {
    user: object;
    comment: string;
    commentReplies: object;
}

interface IReview extends Document {
    user: object;
    rating: number;
    comment: string;
    commentReplies: IComment[];
}

interface ILinks extends Document {
    title: string;
    url: string;
}

interface ICourseData extends Document {
    title: string;
    description: string;
    videoUrl: string;
    videoSection: string;
    videoLength: number;
    videoPlayer: string;
    Links: ILinks[];
    suggestion: string;
    question: IComment[];
}

interface Icourse extends Document {
    name: String;
    description: string;
    price: number;
    estimatedPrice?: number;
    thumnail: object;
    tag: string;
    level: string;
    demoUrl: string;
    benefits: { title: string }[];
    prerequistites: { title: String }[];
    reviews: IReview[];
    courseData: ICourseData[];
    ratings?: number;
    purchased?: number;
    assigment:{title:any}[]
}

interface Iassigment extends Document {
    questions: { title: string }[];
    marks: number;
    result: string;
}

const reviewSchema = new Schema<IReview>({
    user: Object,
    rating: {
        type: Number,
        default: 0,
    },
    comment: String,
});

const LinkSchema = new Schema<ILinks>({
    title: String,
    url: String,
});

const commentSchema = new Schema<IComment>({
    user: Object,
    comment: String,
    commentReplies: [Object],
});

const courseDataSchema = new Schema<ICourseData>({
    videoUrl: String,
    title: String,
    videoSection: String,
    videoLength: Number,
    videoPlayer: String,
    Links: [LinkSchema],
    suggestion: String,
    question: [commentSchema],

});

const assigmentSchema = new Schema<Iassigment>({
    questions: [{ title: String }],
    result: String,

    marks: {
        type: Number,
        default: 0,
    },
});

const courseSchema = new Schema<Icourse>({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    estimatedPrice: {
        type: Number,
    },
    thumnail: {
        public_id: {
            type: String,
        },
        url: {
            type: String,
        },
    },

    tag: {
        type: String,
        require: true,
    },
    level: {
        type: String,
        require: true,
    },
    demoUrl: {
        type: String,
        require: true,
    },

    benefits: [{ title: String }],
    reviews: [reviewSchema],
    courseData: [courseDataSchema],
    prerequistites: [{ title: String }],

    ratings: {
        type: Number,
        default: 0,
    },
    purchased: {
        type: Number,
        default: 0,
    },

    // assigment:[assigmentSchema]
});





const CourseModel:Model<Icourse> = mongoose.model("course",courseSchema);
export default CourseModel