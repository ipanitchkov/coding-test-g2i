import { Injectable, NotFoundException } from '@nestjs/common';
import { Model, Query } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { AcronymItem } from './interfaces/acronymItem.interface';
import { Acronym } from './schemas/acronym.schema';
import { AcronymDto } from './dtos/acronym.dto';
import { getRandomIndexes } from 'src/utils';

@Injectable()
export class AcronymService {
    constructor(@InjectModel('Acronym') private readonly acronymModel: Model<Acronym>) { }

    async create(acronym: AcronymDto): Promise<Acronym> {
        const id: number = await this.acronymModel.countDocuments();
        const newAcronym = new this.acronymModel({_id: id, ...acronym});

        return newAcronym.save();
    }

    async import(acronyms: AcronymItem[]): Promise<void> {
        await this.acronymModel.deleteMany({});

        acronyms.forEach(async (acronym, index) => {
            const [name] = Object.keys(acronym);
            const data = {
                _id: index,
                name,
                definition: acronym[name],
            };
            const newAcronym = new this.acronymModel(data);

            await newAcronym.save();
        });
    }

    async findPaginated(from: number, limit: number, pattern: RegExp): Promise<Acronym[]> {
        return this.acronymModel.find({ name: pattern }).skip(from).limit(limit + 1);
    }

    async findOne(acronym: string): Promise<Acronym> {
        return this.acronymModel.findOne({ name: acronym });
    }

    async update(acronym: string, acronymDefinition: string): Promise<any> {
        const filter = { name: acronym };
        const document = { $set: { definition: acronymDefinition } };
        const options = { new: true };

        return this.acronymModel.updateOne(filter, document);
    }

    async delete(acronym: string): Promise<any> {
        return this.acronymModel.deleteOne({ name: acronym });
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
