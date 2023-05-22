import { Injectable, NotImplementedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GroupClass } from './group.entity';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';
import { GroupTransferDto } from './dto/group-transfer.dto';
import { ChatElement } from './chat/chatElement';
import { ChatElementDto } from './chat/chat.element.dto';
import { UserClass } from '../user.entity';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(GroupClass)
    private groupRepository: Repository<GroupClass>,
    @InjectRepository(ChatElement)
    private elementRepository: Repository<ChatElement>,
  ) {}

  async getGroup(id: number) {
    return await this.groupRepository.find({
      where: { id: id },
    });
  }

  async getGroupByCode(code: string) {
    return await this.groupRepository.find({
      where: { code: code },
    });
  }

  async createGroup(group: GroupTransferDto) {
    if (!(await this.groupRepository.findOne({ where: { code: group.code } })))
      await this.groupRepository.save(new GroupClass(group.code));
  }

  async getCode() {
    let code = crypto.randomBytes(6).toString('hex');
    let group = await this.groupRepository.findOne({ where: { code: code } });
    while (group) {
      code = crypto.randomBytes(6).toString('hex');
      group = await this.groupRepository.findOne({ where: { code: code } });
    }

    return code;
  }

  async addMessage(element: ChatElementDto, user: UserClass) {
    const group = await this.groupRepository.findOne({
      where: { code: element.code },
    });
    if (!group) return;

    const el = new ChatElement(user.username, element.content);
    el.setGroup(group);

    await this.elementRepository.save(el);
  }

  async getMessages(code: string) {
    if (!code) return [];
    const group = await this.groupRepository.find({
      where: { code: code },
    });
    if (group.length === 0) return [];

    const messages = await group[0].history;
    const transfer = [];
    for (let i = 0; i < 50 && i < messages.length; ++i) {
      const el = new ChatElementDto(messages[i].content);
      el.setAuthor(messages[i].author);
      transfer.push(el);
    }

    return { transfer: transfer };
  }
}
