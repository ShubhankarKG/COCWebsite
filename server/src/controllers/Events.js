const express = require('express');
const path = require('path');
const cloudinary = require('cloudinary');
cloudinary.config({
	cloud_name: 'coc-vjti',
	api_key: '552242973352355',
	api_secret: process.env.CLOUDINARY_SECRET
});
const Event = require('../models/Event')

module.exports = {
	async getEvents(_req, res) {
		const events = await Event.find();
		res.json(events);
	},
	async getEventById(req, res) {
		try {
			const eventId = req.params.id;
			const event = await Event.findById(eventId);
			res.json(event);
		} catch (err) {
			res.status(203).send({
				err: err
			})
		}
	},
	async uploadEvent(req, res) {
		try {

			const file = req.file;
			console.log(req.file)
			const image = cloudinary.v2.uploader.upload(file.path);
			req.body.image = {
				url: image.secure_url,
				public_id: image.public_id
			};
			
			const event = await Event.create(req.body);
			res.json({
				"id": event._id
			});
		} catch (err) {
			res.status(203).send({
				err: err
			})
		}
	},
	async updateEvent(req, res) {
		const eventId = req.params.id;
		const event = await Event.findById(eventId);
		res.json({
			"id": event._id
		});
		// TODO ?
	},
	async deleteEvent(req, res) {
		const eventId = req.params.id;
		const event = await Event.findById(eventId);
		await event.remove();
		res.status(204);
	},
	async addForm (req,res) {
		const formURL = req.body.formURL
		const eventId = req.body.id

		try {
			const event = await Event.findByIdAndUpdate(eventId,{form: formURL})

			res.status(200).send({
				message: 'Form added successfully'
			})
		} catch (err) {
			res.status(203).send({
				err: err
			})
		}
	}
}