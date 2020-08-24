import { Injectable, NotFoundException } from '@nestjs/common';
// import { Acronym } from './interfaces/acronym.interface';
import { Model, Mongoose, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { AcronymItem } from './interfaces/acronymItem.interface';
import { Acronym } from './schemas/acronym.schema';
import { AcronymDto } from './dtos/acronym.dto';
import { getRandomIndexes } from 'src/utils';

@Injectable()
export class AcronymService {
    constructor(@InjectModel('Acronym') private readonly acronymModel: Model<Acronym>) { }

    async create(acronym: AcronymDto): Promise<Acronym> {
        const newAcronym = new this.acronymModel(acronym);

        return newAcronym.save();
    }

    async import(acronyms: AcronymItem[]): Promise<void> {
        await this.acronymModel.deleteMany({});

        acronyms.forEach(async (acronym, index) => {
            const [name] = Object.keys(acronym);
            const data = {
                _id: '' + index,
                name,
                definition: acronym[name],
            };

            await this.create(data);
        });
    }

    async findPaginated(from: number, limit: number, search: string): Promise<Acronym[]> {
        const filter = search ? { name: { $regex: search, $options: 'i' } } : {};

        return this.acronymModel.find(filter).skip(from).limit(limit + 1);
    }

    async findOne(acronym: string): Promise<Acronym> {
        return this.acronymModel.findOne({ name: acronym });
    }

    async update(acronym: string, acronymDefinition: string): Promise<void> {
        const filter = { name: acronym };
        const document = { $set: { definition: acronymDefinition } };
        const options = { new: true };

        await this.acronymModel.updateOne(filter, document, options);
    }

    async delete(acronym: string): Promise<void> {
        await this.acronymModel.findByIdAndRemove(acronym);
    }

    async findRandom(count: number): Promise<Acronym[]> {
        const totalNumberOfAcronyms: number = await this.acronymModel.countDocuments();
        const randomIndexes = getRandomIndexes(count, totalNumberOfAcronyms);

        if (count !== randomIndexes.length) {
            throw new NotFoundException(`Can't find ${count} random acronyms among available in the database`);
        }

        return this.acronymModel.find().where('_id').in(randomIndexes);
    }
}
